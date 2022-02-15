import { DBConnect } from "../../../resources/connection/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";

let knex = DBConnect()

export default withSessionRoute(getUserGuilds);

async function getUserGuilds(req, res) {
    let userID = req.body.userID

    if (!userID) return res.status(400).send("MISSING_ARGUMENTS")

    let userGuildsID = (await knex.raw(`select guildID from guildusers where userID = "${userID}"`))[0]

    let parseGuildsID = []
    for (let userGuilds of userGuildsID) {
        parseGuildsID.push(`guildID = ${userGuilds.guildID}`)
    }

    let guildsData = (await knex.raw(`select guildIcon, guildID, guildBackground from guilds where ${parseGuildsID.join(" || ") ? parseGuildsID.join(" || ") : false}`))[0]

    res.status(200).send({ guildsData: guildsData })
}