import { DBConnect } from "../dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

export default withSessionRoute(loginRoute);

async function loginRoute(req, res) {
  let knex = DBConnect()

  let [email, password] = [req.body.email, req.body.password]

  if (!email || !password) return res.status(400).send("MISSING_ARGUMENTS")

  let data = (await knex.raw(`select username, credential, keyword, profileImage from users where credential = "${email.toLowerCase()}" and binary keyword ="${password}"`))[0]

  if (!data[0]?.keyword) return res.status(204).send("USER_NOT_FOUND")

  req.session.user = {
    username: data[0].username,
    email: data[0].credential,
    profilePic: data[0].profileImage
  };
  await req.session.save();

  res.status(200).send("LOGGED_IN");
}