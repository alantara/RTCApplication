import { DBConnect } from "../../../lib/dbconnect"
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseEmail, ParsePassword, ParseName } from "../../../lib/argumentParse"

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

const knex = DBConnect()

export default withSessionRoute(SignUpRoute);

async function SignUpRoute(req, res) {
    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    if (req.session.data) return res.status(403).json({ message: "ALREADY_LOGGED_IN" });

    let [username, email, password] = [req.body.username, req.body.email, req.body.password]

    if (!username || !email || !password) return res.status(400).json({ message: "MISSING_ARGUMENTS" })

    if (!ParseEmail(email)) return res.status(400).json({ message: "INVALID_EMAIL" })
    if (!ParseName(username)) return res.status(400).json({ message: "INVALID_USERNAME" })
    if (!ParsePassword(password)) return res.status(400).json({ message: "INVALID_PASSWORD" })

    try {
        let emailSearch = (await knex.raw(`select accountEmail from accounts where accountEmail = "${email.toLowerCase()}"`))[0]
        if (emailSearch.length != 0) return res.status(401).json({ message: "EMAIL_TAKEN" })
    } catch (err) {
        return res.status(500).json({ message: "EMAIL_SEARCH_ERROR", error: err })
    }

    try {
        let usernameSearch = (await knex.raw(`select accountUsername from accounts where accountUsername = "${username}"`))[0]
        if (usernameSearch.length != 0) return res.status(401).json({ message: "USERNAME_TAKEN" })
    } catch (err) {
        return res.status(500).json({ message: "USERNAME_SEARCH_ERROR", error: err })
    }

    let profilePic = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    let userID = parseInt(uid.idFromTimestamp(Date.now()))

    try {
        await knex.raw(`insert into accounts (accountEmail, accountPassword, accountUsername, profileImage, userID) values ("${email}", "${password}", "${username}", "${profilePic}", ${userID})`)

        req.session = {
            data: {
                user: {
                    username: username,
                    email: email,
                    id: userID,
                    profilePic: profilePic
                },
            }
        };
        await req.session.save();
        res.status(201).json({ message: "USER_CREATED" })
    } catch (err) {
        return res.status(500).json({ message: "SIGNUP_ERROR", error: err })
    }
}