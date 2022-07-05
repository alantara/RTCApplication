//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

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
    if (!guildID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(guildID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await GuildMembers(guildID)
    res.status(api.status).json(api.json)
});


//Guild Channels
export async function GuildMembers(guildID: number) {

    let { data: GUILD_MEMBERS, error: E_GUILD_MEMBERS } = await supabase
        .from('members')
        .select("userID")
        .eq("guildID", guildID)

    if (E_GUILD_MEMBERS) return { status: 500, json: { message: "GUILD_MEMBERS_ERROR", error: E_GUILD_MEMBERS } }

    let memberUsers = GUILD_MEMBERS.map((guild) => { return guild.userID })

    let { data: GUILD_USERS, error: E_GUILD_USERS } = await supabase
        .from('accounts')
        .select("id, email, username, avatar")
        .in("id", memberUsers)

    if (E_GUILD_USERS) return { status: 500, json: { message: "GUILD_USERS_ERROR", error: E_GUILD_USERS } }

    return { status: 200, json: { GUILD_USERS } }
}

export default GuildMembersRoute;