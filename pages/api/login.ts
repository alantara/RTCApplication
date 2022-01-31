import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

    const knex = require('knex')({
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DBNAME
      },
    });

    let data = JSON.parse(JSON.stringify(await knex.raw(`select * from users where username = "${req.body.data.username}"`)))[0][0]

    if (data.password != req.body.data.password) return

    // get user from database then:
    req.session.user = {
      id: req.body.data.username,
    };
    await req.session.save();
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