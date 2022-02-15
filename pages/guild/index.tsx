import { withSessionSsr } from "../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";
import style from "./guildMenu.module.css"
import Link from "next/link";

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

        let userGuilds = await fetch("http://localhost/api/guild/getUserGuilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ userID: req.session.data.user.id })

        })
        let guildsData = (await userGuilds.json()).guildsData

        return {
            props: {
                user: req.session.data.user,
                guilds: JSON.parse(JSON.stringify(guildsData)),
            },
        }
    }
);

export default function SsrProfile({
    user, guilds,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <div className={style.landingPage}>
                <div className={style.guildContainer}>
                    <Link href={`/guild`}>
                        <div className={style.guildIcon}><img src={"https://cdn.dribbble.com/users/1473783/screenshots/6076161/media/e35089e3c113fc063d6d3c0c655cf897.png?compress=1&resize=400x300&vertical=top"} alt="" /></div>
                    </Link>

                    {
                        guilds.map(el => (
                            <Link href={`/guild/${el.guildID}`}>
                                <div className={style.guildIcon}><img src={el.guildIcon} alt="" /></div>
                            </Link>
                        ))
                    }

                    <div onClick={CreateGuildPopup} className={style.guildIcon}><img src="https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/plus-2-icon-11-256.png" alt="" /></div>
                </div>
                <div className={style.backgroundContainer}>
                    <div id="guildCreatePopup" className={`${style.guildPopup} ${style.hidden}`}>
                        <div id="guildCreate" className={`${style.createGuild} ${style.delete}`}>
                            <h2>Create Guild</h2>
                            <p>Guild Image Link</p>
                            <input id="guildImageInput" type="text" />
                            <p>Guild Background Link</p>
                            <input id="guildBackgroundInput" type="text" />
                            <p>Guild Name </p>
                            <input id="guildNameInput" type="text" />
                            <button onClick={CreateGuild}>Create</button>
                            <button>Join</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

    function CreateGuildPopup() {
        document.getElementById("guildCreate").classList.toggle(style.delete)
        document.getElementById("guildCreatePopup").classList.toggle(style.hidden)
    }

    function CreateGuild() {
        fetch("/api/guild/guildCreate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                userID: user.id,
                guildName: document.getElementById("guildNameInput").value,
                guildImage: document.getElementById("guildImageInput").value,
                guildBackground: document.getElementById("guildBackgroundInput").value,

            })

        }).then((req) => {
            if (req.status == 200) { }
        })
    }
}

