import { DBConnect } from "../dbconnect"
import { withSessionRoute } from "../../../lib/sessionHandler";
import {ParseEmail, ParsePassword, ParseUsername} from "./parse"

export default withSessionRoute(SignUp);

async function SignUp(req, res) {
    const knex = DBConnect()

    let [username, email, password] = [req.body.username, req.body.email, req.body.password]

    if (!username || !email || !password) return res.status(400).send("MISSING_ARGUMENTS")

    if (!ParseEmail(email)) return res.status(400).send("INVALID_EMAIL")

    knex.raw(`select credential from users where credential = "${email.toLowerCase()}"`)
        .then((response) => {
            let emailArray = response[0]
            if (emailArray.length != 0) {
                res.status(401).send("EMAIL_TAKEN")
            }
        })
        .catch((err) => {
            console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
            res.status(500).send("DATABASE_ERROR")
        })

    if (!ParseUsername(username)) return res.status(400).send("INVALID_USERNAME")

    knex.raw(`select username from users where username = "${username}"`)
        .then((response) => {
            let usernameArray = response[0]
            if (usernameArray.length != 0) {
                res.status(401).send("USERNAME_TAKEN")
            }
        })
        .catch((err) => {
            console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
            res.status(500).send("DATABASE_ERROR")
        })

    if (!ParsePassword(password)) return res.status(400).send("INVALID_PASSWORD")

    let profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

    await knex.raw(`insert into users (username, credential, keyword, createdAt, profileImage) values ('${req.body.username}', '${req.body.email}', '${req.body.password}', ${Date.now()}, "${profilePic}")`)
        .then(async () => {
            req.session.user = {
                username: username,
                email: email,
                profilePic: profilePic
            };
            await req.session.save();
            res.status(201).send({ message: "USER_CREATED" })
        })
        .catch((err) => {
            console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
            res.status(500).send("DATABASE_ERROR")
        })
}