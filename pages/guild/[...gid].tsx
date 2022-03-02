//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//Custom Data Routes
import { GetUserGuilds } from "../api/guild/getFromUser"
import { GetGuildChannels } from "../api/guild/getGuildChannels"
import { getChannelMessages } from "../api/channel/getChannelMessages"
import { GetMembers } from "../api/guild/getMembers";

//Custom Layout
import GuildBar from "../../components/guildBar";
import ChannelBar from "../../components/channelBar";
import MessageBar from "../../components/messageBar";


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

        let guildsData = (await GetUserGuilds(req.session.data.user.id)).json.guildsData
        let channelList = (await GetGuildChannels(parseInt(query.gid[0]))).json.channelsData
        let memberList = (await GetMembers(parseInt(query.gid[0]))).json.memberList
        let cguild = guildsData?.filter(guilds => { return guilds.guildID == query.gid[0] })[0]

        if (!cguild) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/guild"
                }
            };
        }

        if (query.gid.length == 1) return {
            props: {
                query: query.gid,
                user: req.session.data.user,
                loadGuilds: JSON.parse(JSON.stringify(guildsData)),
                cguild: JSON.parse(JSON.stringify(cguild)),
                channels: JSON.parse(JSON.stringify(channelList)),
                messages: [],
                memberList: JSON.parse(JSON.stringify(memberList)),
            },
        }

        let messageList = (await getChannelMessages(parseInt(query.gid[1]))).json.messageList

        if (query.gid.length == 2) return {
            props: {
                query: query.gid,
                user: req.session.data.user,
                loadGuilds: JSON.parse(JSON.stringify(guildsData)),
                cguild: JSON.parse(JSON.stringify(cguild)),
                channels: JSON.parse(JSON.stringify(channelList)),
                messages: JSON.parse(JSON.stringify(messageList)),
                memberList: JSON.parse(JSON.stringify(memberList)),

            },
        };


        if (query.gid.length > 2) return {
            redirect: {
                permanent: false,
                destination: `/${query.gid[0]}/${query.gid[1]}`
            }
        };

    }
);



export default function SsrProfile({
    query, user, loadGuilds, channels, messages, cguild, memberList
}: InferGetServerSidePropsType<typeof getServerSideProps>) {



    return (
        <div className="grid h-full grid-cols-[75px_225px_auto_250px]">

            <GuildBar loadGuilds={loadGuilds} userID={user.id} />
            <ChannelBar cguild={cguild} query={query} channels={channels} />
            <MessageBar messages={messages} memberList={memberList} query={query} user={user} />
            <div className="p-[40px_0] flex flex-col align-middle bg-[color:var(--terciary-bg-color)]">

            </div>
        </div>
    )



}

