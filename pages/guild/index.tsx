//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//Custom
import { GetUserGuilds } from "../api/guild/getFromUser"
import GuildBar from "../../components/guildBar";
import GuildCreateModal from "../../components/guildCreateModal";
import GuildJoinModal from "../../components/guildJoinModal";

import { useState } from "react";

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

    const [newGuilds, setNewGuilds] = useState([]);

    const [guildIcon, setGuildIcon] = useState(null)
    const [guildBackground, setGuildBackground] = useState(null)
    const [btnDisabled, setBTNDisabled] = useState(false)

    async function GuildCreate(e, guildName) {
        e.preventDefault()
        setBTNDisabled(true)

        if (!guildName || !guildIcon || !guildBackground) return setBTNDisabled(false)


        const body = new FormData();
        body.append("guildName", guildName);
        body.append("guildIcon", guildIcon);
        body.append("guildBackground", guildBackground);

        let imgUp = await fetch("./imageUpload", {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: body
        })
        if (imgUp.status !== 201) {
            setBTNDisabled(false)
        }

        let filenames = await imgUp.json()
        let guildCreate = await fetch("/api/guild/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userID: user.id,
                guildName: filenames.guildName,
                guildImage: `/images/${filenames.guildIconFilename}`,
                guildBackground: `/images/${filenames.guildBackgroundFilename}`,
            })
        })
        if (guildCreate.status !== 201) {
            setBTNDisabled(false);
        }

        setNewGuilds([...newGuilds, { guildIcon: `/images/${filenames.guildIconFilename}`, guildID: (await guildCreate.json()).id }])
        setBTNDisabled(false)

    }

    return (
        <>
            {/* Create Modal */}
            <GuildCreateModal GuildProps={{ GuildCreate, guildIcon, setGuildIcon, guildBackground, setGuildBackground, btnDisabled, setBTNDisabled }} />

            {/* Join Modal */}
            <GuildJoinModal />


            <div className="w-100 h-100 m-0 p-3 grid row overflow-hidden" style={{ backgroundColor: "var(--quaternary-black-bg)", backgroundImage: "url()", backgroundSize: "cover", backgroundPosition: "center" }}>

                <div className="py-4 d-flex flex-column align-items-center gap-2 rounded" style={{ width: "100px", backgroundColor: "var(--primary-black-bg-90)" }}>
                    <GuildBar loadGuilds={loadGuilds} newGuilds={newGuilds} />
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