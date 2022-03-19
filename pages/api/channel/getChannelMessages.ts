import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseOnlyNumbers } from "../../../lib/argumentParse";

let knex = DBConnect()

export default withSessionRoute(getChannelMessagesRoute);

async function getChannelMessagesRoute(req, res) {

    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    let api = await getChannelMessages(req.body.channelID)
    res.status(api.status).json(api.json)
}

export async function getChannelMessages(channelID: number) {
    if (!channelID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!ParseOnlyNumbers(channelID)) return { status: 400, json: { message: "INVALID_CHANNEL_ID" } }

    try {
        let channelMessages = (await knex.raw(`select messageText, messageID, messageAuthorID from messages where channelID = ${channelID}`))[0]
        return { status: 200, json: { channelMessages: channelMessages } }
    } catch (err) {
        return { status: 500, json: { message: "MESSAGE_SEARCH_ERROR", error: err } }
    }
}