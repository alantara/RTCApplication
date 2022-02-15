import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

let knex = DBConnect()

export default withSessionRoute(getMessages);

async function getMessages(req, res) {
    let channelID = req.body.channelID

    if (!channelID) return res.status(400).send("MISSING_ARGUMENTS")

    let messages = (await knex.raw(`select * from messages where channelID = "${channelID}"`))[0]
    res.status(200).send({ messages: messages })
}