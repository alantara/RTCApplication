import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseName, ParseOnlyNumbers } from "../../../lib/argumentParse";

const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

let knex = DBConnect()

export default withSessionRoute(CreateGuildRoute);

async function CreateGuildRoute(req, res) {

  if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

  let [userID, guildName, guildImage, guildBackground] = [req.body.userID, req.body.guildName, req.body.guildImage, req.body.guildBackground]
  let api = await CreateGuild(userID, guildName, guildImage, guildBackground)
  res.status(api.status).json(api.json)
}

export async function CreateGuild(userID: number, guildName: string, guildImage: string, guildBackground: string) {
  if (!userID || !guildName || !guildImage || !guildBackground) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

  if (!ParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
  if (!ParseName(guildName)) return { status: 400, json: { message: "INVALID_GUILD_NAME" } }
  //GUILD IMAGES PARSE

  let id = parseInt(uid.idFromTimestamp(Date.now()))

  try {
    await knex.raw(`insert into guilds (guildName, guildID, guildIcon, guildBackground) values ("${guildName}", ${id}, "${guildImage}", "${guildBackground}")`)

    await knex.raw(`insert into guildusers (userID, guildID) values (${userID}, ${id})`)

    return { status: 201, json: { message: "GUILD_CREATED", id: id } }
  } catch (err) {
    return { status: 500, json: { message: "GUILD_CREATE_ERROR", error: err } }
  }
}