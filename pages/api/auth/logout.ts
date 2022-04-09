//Default Imports
import { withSessionRoute } from "../../../lib/sessionHandler";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const LogOutRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Logout Route
LogOutRoute.post(async (req, res) => {
    if (!req.session.data) return res.status(401).json({ message: "NOT_LOGGED_IN" });

    req.session.destroy();
    return res.status(200).json({ message: "LOGGED_OUT" });

});

export default withSessionRoute(LogOutRoute);