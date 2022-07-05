//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

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
    if (!userID || !guildID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(userID) || isNaN(guildID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await DeleteGuild(userID, guildID)
    res.status(api.status).json(api.json)
});


//Guild Delete
export async function DeleteGuild(userID: number, guildID: number) {

    let { data: DELETE_GUILD, error: E_DELETE_GUILD } = await supabase
        .from('guilds')
        .delete()
        .eq("authorID", userID)
        .eq("id", guildID)

    if (E_DELETE_GUILD) return { status: 500, json: { message: "DELETE_GUILD_ERROR", error: E_DELETE_GUILD } }

    let { data: MEMBER_DELETE, error: E_MEMBER_REMOVE } = await supabase
        .from('members')
        .delete()
        .eq("guildID", guildID)

    if (E_MEMBER_REMOVE) return { status: 500, json: { message: "MEMBER_REMOVE_ERROR", error: E_MEMBER_REMOVE } }

    return { status: 200, json: { DELETE_GUILD } }
}

export default GuildDeleteRoute;