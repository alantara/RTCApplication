//Default Imports
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

//Custom Imports
import { LibParseName, LibParseOnlyNumbers } from "../../../lib/argumentParse";

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

    let api = await CreateGuild(userID, guildName, guildImage)
    res.status(api.status).json(api.json)
});


//Guild Create
export async function CreateGuild(userID: number, guildName: string, guildImage: string) {
    if (!userID || !guildName) return { status: 400, json: { message: "MISSING_ARGUMENTS" } }

    if (!LibParseOnlyNumbers(userID)) return { status: 400, json: { message: "INVALID_USER_ID" } }
    if (!LibParseName(guildName)) return { status: 400, json: { message: "INVALID_GUILD_NAME" } }

    let id = parseInt(uid.idFromTimestamp(Date.now()))

    let { data: CREATE_GUILD, error: CREATE_GUILD_ERROR } = await supabase
        .from('guilds')
        .insert([{ id: id, name: guildName, authorID: userID, iconURL: guildImage }])

    if (CREATE_GUILD_ERROR) return { status: 500, json: { message: "CREATE_GUILD_ERROR", error: CREATE_GUILD_ERROR } }

    let { data: MEMBER_ADD, error: MEMBER_ADD_ERROR } = await supabase
        .from('members')
        .insert([{ userID: userID, guildID: id }])

    if (MEMBER_ADD_ERROR) return { status: 500, json: { message: "MEMBER_ADD_ERROR", error: MEMBER_ADD_ERROR } }

    return { status: 201, json: { CREATE_GUILD } }
}

export default GuildCreateRoute;