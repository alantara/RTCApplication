import { withSessionRoute } from "../../lib/sessionHandler";

export default withSessionRoute(userRoute);

function userRoute(req, res) {
    if (req.session) {
        return res.send({ user: req.session.user });
    }
    return res.send({ status: 403 })
}