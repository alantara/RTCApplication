//Default Imports
import { withSessionRoute } from "../../../lib/sessionHandler";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Argument Parsing
import { LibParseEmail, LibParseName, LibParsePassword } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

//snowflake generator
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

const SignUpRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//SignUp Route
SignUpRoute.post(async (req, res) => {
    if (req.session.data) return res.status(403).json({ message: "ALREADY_LOGGED_IN" });

    let [username, email, password] = [req.body.username, req.body.email, req.body.password]

    if (!username || !email || !password) return res.status(400).json({ message: "MISSING_ARGUMENTS" })

    if (!LibParseEmail(email)) return res.status(400).json({ message: "INVALID_EMAIL" })
    if (!LibParseName(username)) return res.status(400).json({ message: "INVALID_USERNAME" })
    if (!LibParsePassword(password)) return res.status(400).json({ message: "INVALID_PASSWORD" })

    let { data: EMAIL_MATCH_ACCOUNTS, error: EMAIL_ERROR } = await supabase
        .from('accounts')
        .select('email')
        .eq('email', `${email.toLowerCase()}`)

    if (EMAIL_ERROR) return res.status(500).json({ message: "EMAIL_SEARCH_ERROR", error: EMAIL_ERROR })
    if (EMAIL_MATCH_ACCOUNTS.length !== 0) return res.status(403).json({ message: "EMAIL_TAKEN" })

    let { data: USERNAME_MATCH_ACCOUNT, error: USERNAME_ERROR } = await supabase
        .from('accounts')
        .select('email')
        .eq('username', `${username}`)

    if (USERNAME_ERROR) return res.status(500).json({ message: "USERNAME_SEARCH_ERROR", error: USERNAME_ERROR })
    if (USERNAME_MATCH_ACCOUNT.length !== 0) return res.status(403).json({ message: "USERNAME_TAKEN" })

    let userID = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: INSERT_ACCOUNT_DATA, error: INSERT_ACCOUNT_ERROR } = await supabase
        .from('accounts')
        .insert([{ id: userID, email: email, password: password, username: username }])

    if (INSERT_ACCOUNT_ERROR) return res.status(500).json({ message: "INSERT_ACCOUNT_ERROR", error: INSERT_ACCOUNT_ERROR })

    req.session.data = {
        user: {
            username: INSERT_ACCOUNT_DATA[0].username,
            email: INSERT_ACCOUNT_DATA[0].email,
            id: INSERT_ACCOUNT_DATA[0].id,
            avatar: INSERT_ACCOUNT_DATA[0].avatar
        },
    };
    await req.session.save();
    res.status(201).json({ INSERT_ACCOUNT_DATA })
})

export default withSessionRoute(SignUpRoute)