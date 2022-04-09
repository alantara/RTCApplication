//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const GuildChannelsRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Guild Channels Route
GuildChannelsRoute.post(async (req, res) => {
    let [guildID] = [req.body.guildID]

    let api = await GuildChannels(guildID)
    res.status(api.status).json(api.json)
});


//Guild Channels
export async function GuildChannels(guildID: number) {
    if (!guildID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(guildID)) return { status: 400, json: { message: "INVALID_GUILD_ID" } }

    let { data: GUILD_CHANNELS, error: GUILD_CHANNELS_ERROR } = await supabase
        .from('channels')
        .select("id,name,type")
        .eq("guildID", guildID)

    if (GUILD_CHANNELS_ERROR) return { status: 500, json: { message: "GUILD_CHANNELS_ERROR", error: GUILD_CHANNELS_ERROR } }

    return { status: 200, json: { GUILD_CHANNELS } }
}

export default GuildChannelsRoute;