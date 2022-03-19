//Essentials
import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseOnlyNumbers } from "../../../lib/argumentParse";

let knex = DBConnect()

export default withSessionRoute(GetUserGuildsRoute);

async function GetUserGuildsRoute(req, res) {

    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    let api = await GetUserGuilds(req.body.userID)
    res.status(api.status).json(api.json)
}

export async function GetUserGuilds(userID: number) {

    if (!userID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!ParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }

    try {
        let userGuildsID = (await knex.raw(`select guildID from guildusers where userID = "${userID}"`))[0]

        let parseGuildsID = []
        for (let userGuilds of userGuildsID) {
            parseGuildsID.push(`guildID = ${userGuilds.guildID}`)
        }

        let userGuilds = (await knex.raw(`select guildName, guildIcon, guildID, guildBackground from guilds where ${parseGuildsID.join(" || ") ? parseGuildsID.join(" || ") : false}`))[0]

        return { status: 200, json: { userGuilds: userGuilds } }
    } catch (err) {
        return { status: 500, json: { message: "GUILD_SEARCH_ERROR", error: err } }
    }
}