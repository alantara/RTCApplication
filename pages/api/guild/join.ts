//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Database Imports
const supabase = global.supabase

const GuildJoinRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Guild Join Route
GuildJoinRoute.post(async (req, res) => {
    let [userID, guildID] = [req.body.userID, req.body.guildID]
    if (!userID || !guildID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(userID) || isNaN(guildID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await JoinGuild(userID, guildID)
    res.status(api.status).json(api.json)
});


//Guild Join
export async function JoinGuild(userID: number, guildID: number) {
    let { data: MEMBER_ADD, error: E_MEMBER_ADD } = await supabase
        .from('members')
        .insert([{ userID: userID, guildID: guildID }])

    if (E_MEMBER_ADD) return { status: 500, json: { message: "MEMBER_ADD_ERROR", error: E_MEMBER_ADD } }

    let { data: MEMBER_GUILD, error: E_MEMBER_GUILD } = await supabase
        .from('guilds')
        .select("id,name,iconURL,backgroundURL")
        .eq("guildID", guildID)

    if (E_MEMBER_GUILD) return { status: 500, json: { message: "MEMBER_GUILD_ERROR", error: E_MEMBER_GUILD } }


    return { status: 200, json: { MEMBER_GUILD } }
}

export default GuildJoinRoute;