//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//Custom
import { GetUserGuilds } from "../api/guild/getFromUser"
import GuildBar from "../../components/guildBar";


export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
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

        return {
            props: {
                user: req.session.data.user,
                loadGuilds: JSON.parse(JSON.stringify(guildsData)),
            },
        }
    }
);

export default function SsrProfile({
    user, loadGuilds
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className="grid h-full grid-cols-[75px_auto]">
            <GuildBar loadGuilds={loadGuilds} userID={user.id} />
            <div style={{ backgroundImage: "" }} className="bg-[color:var(--secondary-bg-color)] bg-center bg-cover">

            </div>
        </div>
    )
}