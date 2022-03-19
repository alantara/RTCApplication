import { DBConnect } from "../../../lib/dbconnect";
import { withSessionRoute } from "../../../lib/sessionHandler";
import { ParseOnlyNumbers } from "../../../lib/argumentParse";

let knex = DBConnect()

export default withSessionRoute(GetMembersRoute);

async function GetMembersRoute(req, res) {

    if (req.method != "POST") return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });

    let api = await GetMembers(req.body.guildID)
    res.status(api.status).json(api.json)
}

export async function GetMembers(guildID: number) {
    if (!guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!ParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_USER_ID" } }

    try {
        let guildMembersID = (await knex.raw(`select userID from guildusers where guildID = ${guildID}`))[0]

        let parseMemberID = []
        for (let userGuilds of guildMembersID) {
            parseMemberID.push(`userID = ${userGuilds.userID}`)
        }

        let guildMembers = (await knex.raw(`select accountUsername, profileImage, userID from accounts where ${parseMemberID.join(" || ") ? parseMemberID.join(" || ") : false}`))[0]

        return { status: 201, json: { guildMembers: guildMembers } }
    } catch (err) {
        return { status: 500, json: { message: "GET_MEMBER_ERROR", error: err } }
    }
}