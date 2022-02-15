import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(messageCreate);

async function messageCreate(req, res) {
  let [message, userID, channelID] = [req.body.message, req.body.userID, req.body.channelID]

  if (!message || !userID || !channelID) return res.status(400).send("MISSING_ARGUMENTS")

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  await knex.raw(`insert into messages (messageText, channelID, messageID, messageAuthorID) values ("${message}", ${channelID}, ${id}, ${userID})`)

  res.status(200).send("MESSAGE_CREATED");
}