//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

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

    let api = await UserGuilds(userID)
    res.status(api.status).json(api.json)
});


//User Guilds
export async function UserGuilds(userID: number) {
    if (!userID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }

    let { data: USER_GUILDS_ID, error: USER_GUILDS_ID_ERROR } = await supabase
        .from('members')
        .select("guildID")
        .eq("userID", userID)

    if (USER_GUILDS_ID_ERROR) return { status: 500, json: { message: "USER_GUILDS_ID_ERROR", error: USER_GUILDS_ID_ERROR } }

    let userGuilds = USER_GUILDS_ID.map((guild) => { return guild.guildID })

    let { data: USER_GUILDS, error: USER_GUILDS_ERROR } = await supabase
        .from('guilds')
        .select("id,name,iconURL,backgroundURL")
        .in("id", userGuilds)

    if (USER_GUILDS_ERROR) return { status: 500, json: { message: "USER_GUILDS_ERROR", error: USER_GUILDS_ERROR } }

    return { status: 200, json: { USER_GUILDS } }
}

export default UserGuildsRoute;