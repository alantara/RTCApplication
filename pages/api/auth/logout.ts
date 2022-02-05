import { withSessionRoute } from "../../../lib/sessionHandler";

export default withSessionRoute(logoutRoute);

function logoutRoute(req, res) {
    req.session.destroy();
    res.send({ ok: true });
}