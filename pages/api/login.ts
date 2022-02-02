import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { DBConnect } from "./dbconnect";

export default withIronSessionApiRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {

    let knex = DBConnect()

    if (!req.body.email || !req.body.password) return res.status(400).send("INPUT_BLANK")

    //PARSE CREDENTIAL AND KEYWORD
    let inputCredential = req.body.email
    let inputKeyword = req.body.password

    let data = (await knex.raw(`select * from users where credential = "${inputCredential}"`))[0]

    if (data[0].keyword != inputKeyword) return

    req.session.user = {
      id: data[0].username,
      profilePic: data[0].profileImage
    };
    await req.session.save();

    res.status(200).send("LOGGED_IN");
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