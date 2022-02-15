import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(guildAdd);

async function guildAdd(req, res) {
  let [guildID, guildName] = [req.body.guildID, req.body.guildName]

  if (!guildID || !guildName) return res.status(400).send("MISSING_ARGUMENTS")

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  await knex.raw(`insert into channels (channelName, channelID, guildID) values ("${guildName}", ${id}, ${guildID})`)

  res.status(200).send("GUILD_CREATED");
}