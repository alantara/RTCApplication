//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const GuildMembersRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Guild Members Route
GuildMembersRoute.post(async (req, res) => {
    let [guildID] = [req.body.guildID]

    let api = await GuildMembers(guildID)
    res.status(api.status).json(api.json)
});


//Guild Channels
export async function GuildMembers(guildID: number) {
    if (!guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_GUILD_ID" } }

    let { data: GUILD_MEMBERS, error: GUILD_MEMBERS_ERROR } = await supabase
        .from('members')
        .select("userID")
        .eq("guildID", guildID)

    if (GUILD_MEMBERS_ERROR) return { status: 500, json: { message: "GUILD_MEMBERS_ERROR", error: GUILD_MEMBERS_ERROR } }

    let memberUsers = GUILD_MEMBERS.map((guild) => { return guild.userID })

    let { data: GUILD_USERS, error: GUILD_USERS_ERROR } = await supabase
        .from('accounts')
        .select("id, email, username, avatar")
        .in("id", memberUsers)

    if (GUILD_USERS_ERROR) return { status: 500, json: { message: "GUILD_USERS_ERROR", error: GUILD_USERS_ERROR } }

    return { status: 200, json: { GUILD_USERS } }
}

export default GuildMembersRoute;