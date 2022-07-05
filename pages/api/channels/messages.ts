//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Database Imports
const supabase = global.supabase

const ChannelMessagesRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Channel Messages Route
ChannelMessagesRoute.post(async (req, res) => {
    let [channelID] = [req.body.channelID]
    if (!channelID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(channelID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await ChannelMessages(channelID)
    res.status(api.status).json(api.json)
});


//Channel Messages
export async function ChannelMessages(channelID: number) {

    let { data: CHANNEL_MESSAGES, error: E_CHANNEL_MESSAGES } = await supabase
        .from('messages')
        .select("id,text,authorID")
        .eq("channelID", channelID)

    if (E_CHANNEL_MESSAGES) return { status: 500, json: { message: "CHANNEL_MESSAGES_ERROR", error: E_CHANNEL_MESSAGES } }

    return { status: 200, json: { CHANNEL_MESSAGES } }
}

export default ChannelMessagesRoute;