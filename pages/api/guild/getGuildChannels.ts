import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseOnlyNumbers } from "../../../lib/argumentParse";

let knex = DBConnect()

export default withSessionRoute(GetGuildChannelsRoute);

async function GetGuildChannelsRoute(req, res) {

    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    let api = await GetGuildChannels(req.body.guildID)
    res.status(api.status).json(api.json)

}

export async function GetGuildChannels(guildID: number) {
    if (!guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!ParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_USER_ID" } }

    try {
        let guildChannels = (await knex.raw(`select channelName, channelID, channelType from channels where guildID = "${guildID}"`))[0]
        return { status: 200, json: { guildChannels: guildChannels } }
    } catch (err) {
        return { status: 500, json: { message: "CHANNEL_SEARCH_ERROR", error: err } }
    }
}
