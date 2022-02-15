import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseEmail, ParsePassword } from "./argumentParse"

const knex = DBConnect()

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {

  let [email, password] = [req.body.email, req.body.password]

  if (!email || !password) return res.status(400).send("MISSING_ARGUMENTS")

  if (!ParseEmail(email)) return res.status(400).send("INVALID_EMAIL")
  if (!ParsePassword(password)) return res.status(400).send("INVALID_PASSWORD")

  let data = (await knex.raw(`select accountUsername, accountEmail, accountPassword, profileImage, userID from accounts where accountEmail = "${email.toLowerCase()}" and binary accountPassword ="${password}"`))[0]
  if (!data[0]) return res.status(204).send("USER_NOT_FOUND")

  req.session.data = {
    user: {
      username: data[0].accountUsername,
      email: data[0].accountEmail,
      id: data[0].userID,
      profilePic: data[0].profileImage
    },
  };
  await req.session.save();

  res.status(200).send("LOGGED_IN");
}