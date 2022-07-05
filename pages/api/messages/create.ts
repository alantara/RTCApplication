//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Snowflake
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Database Imports
const supabase = global.supabase

const MessageCreateRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Message Create Route
MessageCreateRoute.post(async (req, res) => {
    let [text, userID, channelID] = [req.body.text, req.body.userID, req.body.channelID]
    if (!text || !userID || !channelID) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(userID) || isNaN(channelID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await MessageCreate(text, userID, channelID)
    res.status(api.status).json(api.json)
});


//Message Create
export async function MessageCreate(text: string, userID: number, channelID: number) {
    let id = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: MESSAGE_CREATE, error: E_MESSAGE_CREATE } = await supabase
        .from('messages')
        .insert([{ id: id, text: text, channelID: channelID, authorID: userID }])

    if (E_MESSAGE_CREATE) return { status: 500, json: { message: "MESSAGE_CREATE_ERROR", error: E_MESSAGE_CREATE } }

    return { status: 201, json: { MESSAGE_CREATE } }
}

export default MessageCreateRoute;