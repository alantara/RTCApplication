import { ParseOnlyNumbers } from "../../../lib/argumentParse";
import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(MessageCreateRoute);

async function MessageCreateRoute(req, res) {
  if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

  let [message, userID, channelID] = [req.body.message, req.body.userID, req.body.channelID]

  let api = await MessageCreate(message, userID, channelID)
  res.status(api.status).json(api.json)
}


export async function MessageCreate(message, userID, channelID) {

  if (!message || !userID || !channelID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

  if (!ParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
  if (!ParseOnlyNumbers(channelID)) return { status: 400, json: { message: "INVALID_CHANNEL_ID" } }

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  try {
    await knex.raw(`insert into messages (messageText, channelID, messageID, messageAuthorID) values ("${message}", ${channelID}, ${id}, ${userID})`)

    return { status: 200, json: { message: "MESSAGE_CREATED", text: message, id: id, author: userID } };
  } catch (err) {
    return { status: 500, json: { message: "MESSAGE_CREATE_ERROR", error: err } }
  }
}