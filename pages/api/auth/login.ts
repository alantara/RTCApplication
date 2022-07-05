//Default Api Imports
import { withSessionRoute } from "../../../lib/sessionHandler";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Argument Parsing
import { LibParseEmail, LibParsePassword } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const LogInRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

//Login Route
LogInRoute.post(async (req, res) => {
    if (req.session.data) return res.status(403).json({ message: "ALREADY_LOGGED_IN" });

    let [email, password] = [req.body.email, req.body.password]
    if (!email || !password) return res.status(400).json({ message: "MISSING_ARGUMENTS" })

    if (!LibParseEmail(email)) return res.status(400).json({ message: "INVALID_EMAIL" })
    if (!LibParsePassword(password)) return res.status(400).json({ message: "INVALID_PASSWORD" })

    let { data: MATCH_ACCOUNTS, error: MATCH_ACCOUNTS_ERROR } = await supabase
        .from('accounts')
        .select('username,email,avatar,id')
        .eq('email', `${email.toLowerCase()}`)
        .eq("password", `${password}`)

    if (MATCH_ACCOUNTS_ERROR) return res.status(500).json({ message: "LOGIN_ERROR", error: MATCH_ACCOUNTS_ERROR })

    if (!MATCH_ACCOUNTS[0]) return res.status(404).json({ message: "INVALID_CREDENTIALS" })
    if (MATCH_ACCOUNTS.length > 1) return res.status(403).json({ message: "MULTIPLE_USERS" })

    let USER_ACCOUNT = MATCH_ACCOUNTS[0]

    req.session.data = {
        user: {
            username: USER_ACCOUNT.username,
            email: USER_ACCOUNT.email,
            id: USER_ACCOUNT.id,
            avatar: USER_ACCOUNT.avatar
        },
    };
    await req.session.save();
    return res.status(200).json({ USER_ACCOUNT });

});

export default withSessionRoute(LogInRoute);