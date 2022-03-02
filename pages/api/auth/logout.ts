import { withSessionRoute } from "../../../lib/sessionHandler";

export default withSessionRoute(LogoutRoute);

function LogoutRoute(req, res) {
    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    if (!req.session.data) return res.status(403).json({ message: "NOT_LOGGED_IN" });

    try {
        req.session.destroy();
        return res.status(200).json({ message: "LOGGED_OUT" });
    } catch (err) {
        return res.status(500).json({ message: "LOGOUT_ERROR", error: err })
    }
}