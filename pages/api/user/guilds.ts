//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { LibParseNumberOnly } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const UserGuildsRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//User Guilds Route
UserGuildsRoute.post(async (req, res) => {
    let [userID] = [req.body.userID]
    if (!userID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(userID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await UserGuilds(userID)
    res.status(api.status).json(api.json)
});


//User Guilds
export async function UserGuilds(userID: number) {
    let { data: USER_GUILDS_ID, error: E_USER_GUILDS_ID } = await supabase
        .from('members')
        .select("guildID")
        .eq("userID", userID)

    if (E_USER_GUILDS_ID) return { status: 500, json: { message: "USER_GUILDS_ID_ERROR", error: E_USER_GUILDS_ID } }

    let userGuildsIDMap = USER_GUILDS_ID.map((guild) => { return guild.guildID })

    let { data: USER_GUILDS, error: E_USER_GUILDS } = await supabase
        .from('guilds')
        .select("id,name,iconURL,backgroundURL")
        .in("id", userGuildsIDMap)

    if (E_USER_GUILDS) return { status: 500, json: { message: "USER_GUILDS_ERROR", error: E_USER_GUILDS } }

    return { status: 200, json: { USER_GUILDS } }
}

export default UserGuildsRoute;