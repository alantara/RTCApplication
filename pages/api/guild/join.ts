//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

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

    let api = await JoinGuild(userID, guildID)
    res.status(api.status).json(api.json)
});


//Guild Join
export async function JoinGuild(userID: number, guildID: number) {
    if (!userID || !guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
    if (!LibParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_GUILD_ID" } }

    let { data: MEMBER_ADD, error: MEMBER_ADD_ERROR } = await supabase
        .from('members')
        .insert([{ userID: userID, guildID: guildID }])

    if (MEMBER_ADD_ERROR) return { status: 500, json: { message: "MEMBER_ADD_ERROR", error: MEMBER_ADD_ERROR } }

    let { data: MEMBER_GUILD, error: MEMBER_GUILD_ERROR } = await supabase
        .from('guilds')
        .select("id,name,iconURL,backgroundURL")
        .eq("guildID", guildID)

    if (MEMBER_GUILD_ERROR) return { status: 500, json: { message: "MEMBER_GUILD_ERROR", error: MEMBER_GUILD_ERROR } }


    return { status: 200, json: { MEMBER_GUILD } }
}

export default GuildJoinRoute;