//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const GuildDeleteRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Guild Delete Route
GuildDeleteRoute.post(async (req, res) => {
    let [userID, guildID] = [req.body.userID, req.body.guildID]

    let api = await DeleteGuild(userID, guildID)
    res.status(api.status).json(api.json)
});


//Guild Delete
export async function DeleteGuild(userID: number, guildID: number) {
    if (!userID || !guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
    if (!LibParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_GUILD_ID" } }

    let { data: DELETE_GUILD, error: DELETE_GUILD_ERROR } = await supabase
        .from('guilds')
        .delete()
        .eq("authorID", userID)
        .eq("id", guildID)

    if (DELETE_GUILD_ERROR) return { status: 500, json: { message: "DELETE_GUILD_ERROR", error: DELETE_GUILD_ERROR } }

    let { data: MEMBER_DELETE, error: MEMBER_REMOVE_ERROR } = await supabase
        .from('members')
        .delete()
        .eq("guildID", guildID)

    if (MEMBER_REMOVE_ERROR) return { status: 500, json: { message: "MEMBER_REMOVE_ERROR", error: MEMBER_REMOVE_ERROR } }

    return { status: 200, json: { DELETE_GUILD } }
}

export default GuildDeleteRoute;