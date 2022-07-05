//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Snowflake
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Custom Imports
import { LibParseName } from "../../../lib/argumentParse";

//Database Imports
const supabase = global.supabase

const ChannelCreateRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Channel Create Route
ChannelCreateRoute.post(async (req, res) => {
    let [guildID, channelName, channelType] = [req.body.guildID, req.body.channelName, req.body.channelType]
    if (!guildID || !channelName || !channelType) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(guildID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await ChannelCreate(guildID, channelName, channelType)
    res.status(api.status).json(api.json)
});


//Channel Create
export async function ChannelCreate(guildID: number, channelName: string, channelType: string) {

    if (!LibParseName(channelName)) return { status: 400, json: { message: "INVALID_CHANNEL_NAME" } }
    if (!LibParseName(channelType)) return { status: 400, json: { message: "INVALID_CHANNEL_TYPE" } }

    let id = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: CREATE_CHANNEL, error: E_CREATE_CHANNEL } = await supabase
        .from('channels')
        .insert([{ id: id, name: channelName, guildID: guildID, type: channelType }])

    if (E_CREATE_CHANNEL) return { status: 500, json: { message: "CREATE_CHANNEL_ERROR", error: E_CREATE_CHANNEL } }

    return { status: 201, json: { CREATE_CHANNEL } }
}

export default ChannelCreateRoute;