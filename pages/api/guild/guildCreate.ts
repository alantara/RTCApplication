import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(guildAdd);

async function guildAdd(req, res) {
  let [userID, guildName, guildImage, guildBackground] = [req.body.userID, req.body.guildName, req.body.guildImage, req.body.guildBackground]

  if (!userID || !guildName || !guildImage || !guildBackground) return res.status(400).send("MISSING_ARGUMENTS")

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  await knex.raw(`insert into guilds (guildName, guildID, guildIcon, guildBackground) values ("${guildName}", ${id}, "${guildImage}", "${guildBackground}")`)

  await knex.raw(`insert into guildusers (userID, guildID) values (${parseInt(userID)}, ${id})`)

  res.status(200).send("GUILD_CREATED");
}