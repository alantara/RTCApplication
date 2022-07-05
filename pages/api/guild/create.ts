//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { LibParseName } from "../../../lib/argumentParse";

//snowflake generator
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Database Imports
const supabase = global.supabase

const GuildCreateRoute = nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
        res.status(501).json({ message: "API_ERROR", error: error.message });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


//Guild Create Route
GuildCreateRoute.post(async (req, res) => {
    let [userID, guildName, guildImage] = [req.body.userID, req.body.guildName, req.body.guildImage]
    if (!userID || !guildName || !guildImage) return res.status(400).json({ message: "MISSING_ARGUMENTS" })
    if (isNaN(userID)) return res.status(400).json({ message: "ARGUMENT_INVALID_TYPE" })

    let api = await CreateGuild(userID, guildName, guildImage)
    res.status(api.status).json(api.json)
});


//Guild Create
export async function CreateGuild(userID: number, guildName: string, guildImage: string) {

    if(!LibParseName(guildName)) return { status: 400, json: { message: "INVALID_GUILD_NAME" } }

    let id = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: CREATE_GUILD, error: E_CREATE_GUILD } = await supabase
        .from('guilds')
        .insert([{ id: id, name: guildName, authorID: userID, iconURL: guildImage }])

    if (E_CREATE_GUILD) return { status: 500, json: { message: "CREATE_GUILD_ERROR", error: E_CREATE_GUILD } }

    let { data: MEMBER_ADD, error: E_MEMBER_ADD } = await supabase
        .from('members')
        .insert([{ userID: userID, guildID: id }])

    if (E_MEMBER_ADD) return { status: 500, json: { message: "MEMBER_ADD_ERROR", error: E_MEMBER_ADD } }

    return { status: 201, json: { CREATE_GUILD } }
}

export default GuildCreateRoute;