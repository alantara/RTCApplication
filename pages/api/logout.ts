import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    function logoutRoute(req, res, session) {
        req.session.destroy();
        res.send({ ok: true });
    },
    {
        cookieName: "myapp_cookiename",
        password: "UPsYAQivZL1CTZ2pohnJFcPVyDFR1Xeh0Wn",
        // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    },
);