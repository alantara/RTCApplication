//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Snowflake
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Custom Imports
import { LibParseOnlyNumbers } from "../../../lib/argumentParse";

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

    let api = await MessageCreate(text, userID, channelID)
    res.status(api.status).json(api.json)
});


//Message Create
export async function MessageCreate(text: string, userID: number, channelID: number) {
    if (!text || !userID || !channelID) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
    if (!LibParseOnlyNumbers(channelID)) return { status: 400, json: { message: "INVALID_CHANNEL_ID" } }

    let id = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: MESSAGE_CREATE, error: MESSAGE_CREATE_ERROR } = await supabase
        .from('messages')
        .insert([{ id: id, text: text, channelID: channelID, authorID: userID }])

    if (MESSAGE_CREATE_ERROR) return { status: 500, json: { message: "MESSAGE_CREATE_ERROR", error: MESSAGE_CREATE_ERROR } }

    return { status: 201, json: { MESSAGE_CREATE } }
}

export default MessageCreateRoute;