import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseEmail, ParsePassword } from "../../../lib/argumentParse"

const knex = DBConnect()

export default withSessionRoute(LogInRoute);

async function LogInRoute(req, res) {
  if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

  if (req.session.data) return res.status(403).json({ message: "ALREADY_LOGGED_IN" });

  let [email, password] = [req.body.email, req.body.password]

  if (!email || !password) return res.status(400).json({ message: "MISSING_ARGUMENTS" })

  if (!ParseEmail(email)) return res.status(400).json({ message: "INVALID_EMAIL" })
  if (!ParsePassword(password)) return res.status(400).json({ message: "INVALID_PASSWORD" })

  try {
    let data = (await knex.raw(`select accountUsername, accountEmail, profileImage, userID from accounts where accountEmail = "${email.toLowerCase()}" and binary accountPassword ="${password}"`))[0]
    if (!data[0]) return res.status(404).json({ message: "USER_NOT_FOUND" })

    req.session = {
      data: {
        user: {
          username: data[0].accountUsername,
          email: data[0].accountEmail,
          id: data[0].userID,
          profilePic: data[0].profileImage
        },
      }
    };
    await req.session.save();
    return res.status(200).json({ message: "LOGGED_IN" });

  } catch (err) {
    return res.status(500).json({ message: "LOGIN_ERROR", error: err })
  }

}