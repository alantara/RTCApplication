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

        let userGuilds = (await GetUserGuilds(req.session.data.user.id)).json.userGuilds

        return {
            props: {
                user: req.session.data.user,
                userGuilds: JSON.parse(JSON.stringify(userGuilds)),
            },
        }
    }
);

export default function SsrProfile({
    user, userGuilds
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <div className="w-100 h-100 m-0 p-3 grid row overflow-hidden" style={{ backgroundColor: "var(--quaternary-black-bg)", backgroundImage: "url()", backgroundSize: "cover", backgroundPosition: "center" }}>

                <div className="py-4 d-flex flex-column align-items-center gap-2 rounded" style={{ width: "100px", backgroundColor: "var(--primary-black-bg-90)" }}>
                    <GuildBar userGuilds={userGuilds} user={user} />
                </div>

                <div className="p-0 d-flex flex-column" style={{ width: "440px" }}>
                    <div className="h-25 m-2 mt-0 p-0 row rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>

                    </div>
                    <div className="h-75 m-0 p-0 row">
                        <div className="m-2 mb-0 p-0 col rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>

                        </div>
                        <div className="m-2 mb-0 p-0 col rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>

                        </div>
                    </div>
                </div>

                <div className="h-100 m-0 p-0 col rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }} >

                </div>

            </div>
        </>
    )
}