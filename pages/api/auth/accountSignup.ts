import { DBConnect } from "../../../resources/connection/dbconnect"
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseEmail, ParsePassword, ParseUsername } from "./argumentParse"

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

const knex = DBConnect()

export default withSessionRoute(SignUp);

async function SignUp(req, res) {
    let [username, email, password] = [req.body.username, req.body.email, req.body.password]

    if (!username || !email || !password) return res.status(400).send("MISSING_ARGUMENTS")

    if (!ParseEmail(email)) return res.status(400).send("INVALID_EMAIL")
    if (!ParseUsername(username)) return res.status(400).send("INVALID_USERNAME")
    if (!ParsePassword(password)) return res.status(400).send("INVALID_PASSWORD")

    let emailSearch = (await knex.raw(`select accountEmail from accounts where accountEmail = "${email.toLowerCase()}"`))[0]
    if (emailSearch.length != 0) return res.status(401).send("EMAIL_TAKEN")

    let usernameSearch = (await knex.raw(`select accountUsername from accounts where accountUsername = "${username}"`))[0]
    if (usernameSearch.length != 0) return res.status(401).send("USERNAME_TAKEN")

    let profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    let userID = parseInt(uid.idFromTimestamp(Date.now()))

    await knex.raw(`insert into accounts (accountEmail, accountPassword, accountUsername, profileImage, userID) values ("${email}", "${password}", "${username}", "${profilePic}", ${userID})`)
        .then(async () => {
            req.session.data = {
                user: {
                    username: username,
                    email: email,
                    id: userID,
                    profilePic: profilePic
                },
            };
            await req.session.save();
            res.status(201).send({ message: "USER_CREATED" })
        })
        .catch((err) => {
            console.log(`[Error] > Dir(/api/signup.ts)\n    ${err}`)
            res.status(500).send("DATABASE_ERROR")
        })
}