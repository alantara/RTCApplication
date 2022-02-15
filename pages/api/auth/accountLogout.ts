import { withSessionRoute } from "../../../lib/sessionHandler";

export default withSessionRoute(logoutRoute);

function logoutRoute(req, res) {
    req.session.destroy();
    res.status(200).send("LOGGED_OUT");
}