import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

let knex = DBConnect()

export default withSessionRoute(guildAdd);

async function guildAdd(req, res) {
    let guildID = req.body.guildID

    if (!guildID) return res.status(400).send("MISSING_ARGUMENTS")

    let channels = (await knex.raw(`select channelName, channelID, guildID from channels where guildID = "${guildID}"`))[0]
    res.status(200).send({ channels: channels })
}