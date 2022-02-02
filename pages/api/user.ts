import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    function userRoute(req, res) {
        if (req.session) {
            return res.send({ user: req.session.user });
        }
        return res.send({ status: 403 })
    },
    {
        cookieName: "authcookie",
        password: "UPsYAQivZL1CTZ2pohnJFcPVyDFR1Xeh0Wn",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: false,
        },
    },
);