import { ParseOnlyNumbers, ParseName } from "../../../lib/argumentParse";
import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(ChannelCreate);

async function ChannelCreate(req, res) {

  if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

  let [guildID, channelName, channelType] = [req.body.guildID, req.body.channelName, req.body.channelType]

  if (!guildID || !channelName || !channelType) return res.status(400).send("MISSING_ARGUMENTS")

  if (!ParseOnlyNumbers(guildID)) return res.status(400).json({ message: "INVALID_GUILD_ID" })
  if (!ParseName(channelName)) return res.status(400).json({ message: "INVALID_GUILD_NAME" })

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  try {
    await knex.raw(`insert into channels (channelName, channelID, guildID, channelType) values ("${channelName}", ${id}, ${guildID}, "${channelType}")`)

    res.status(200).send("CHANNEL_CREATED");
  } catch (err) {
    return res.status(500).json({ message: "CHANNEL_CREATE_ERROR", error: err })
  }
}