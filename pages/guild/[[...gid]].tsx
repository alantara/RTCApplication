//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//Custom Data Routes
import { UserGuilds } from "../api/user/guilds"
import { GuildChannels } from "../api/guild/channels"
import { ChannelMessages } from "../api/channels/messages"
import { GuildMembers } from "../api/guild/members";

//Custom Components
import GuildBar from "../components/bar/guild";
import ChannelBar from "../components/bar/channel";

//Others
import css from "./guild.module.css"
import { LibParse } from "../../lib/json/parse";
import MessageBar from "../components/bar/message";

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req, query }) {
        const sessionData = req.session.data;
        if (!sessionData) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/login"
                }
            };
        }

        const userGuilds = (await UserGuilds(sessionData.user.id)).json.USER_GUILDS

        if (!query.gid) return {
            props: {
                user: sessionData.user,
                userGuilds: LibParse(userGuilds),
                currentGuild: null,
                currentChannel: null
            },
        }

        const connectedGuildID = query.gid[0]

        const currentGuild = userGuilds?.filter(guilds => { return guilds.id == connectedGuildID })[0]
        if (!currentGuild) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/guild"
                }
            };
        }

        const guildChannels = (await GuildChannels(parseInt(connectedGuildID))).json.GUILD_CHANNELS
        const guildMembers = (await GuildMembers(parseInt(connectedGuildID))).json.GUILD_USERS

        const connectedChannelID = query.gid[1]

        if (!connectedChannelID) return {
            props: {
                user: req.session.data.user,
                userGuilds: LibParse(userGuilds),
                currentGuild: {
                    data: LibParse(currentGuild),
                    channels: LibParse(guildChannels),
                    members: LibParse(guildMembers),
                },
                currentChannel: null
            },
        }

        const channelMessages = (await ChannelMessages(parseInt(connectedChannelID))).json.CHANNEL_MESSAGES

        const linkOverflowHandler = query.gid[2]

        if (!linkOverflowHandler) return {
            props: {
                user: req.session.data.user,
                userGuilds: LibParse(userGuilds),
                currentGuild: {
                    data: LibParse(currentGuild),
                    channels: LibParse(guildChannels),
                    members: LibParse(guildMembers),
                },
                currentChannel: {
                    id: LibParse(connectedChannelID),
                    messages: LibParse(channelMessages)
                }
            },
        };

        return {
            redirect: {
                permanent: false,
                destination: `/${connectedGuildID}/${connectedChannelID}`
            }
        };

    }
);

const { io } = require("socket.io-client")
const clientSocket = io();

export default function SsrProfile({
    user, userGuilds, currentGuild, currentChannel
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    clientSocket.emit("id-set", { socketID: user.id })

    return (
        <div className={`w-100 h-100 m-0 p-0 grid row overflow-hidden ${css.background}`}>
            <GuildBar user={user} userGuilds={userGuilds} guildID={currentGuild?.data.id} />
            {currentGuild ? <ChannelBar currentGuild={currentGuild} clientSocket={clientSocket} userID={user.id} /> : <></>}
            {currentChannel ? <MessageBar user={user} currentGuild={currentGuild} currentChannel={currentChannel} /> : <></>}
            {/* <div className={`h-100 m-0 p-0 d-flex flex-column ${css.memberBar}`}>

            </div> */}
        </div>
    )
}