//Next & React
import Link from "next/link";
import { useEffect, useState } from "react";
import { LibLogOut } from "../../../../lib/auth/index";

//Modals
import GuildCreateModal from "../../modals/guild/create";
import GuildJoinModal from "../../modals/guild/join";

//CSS
import css from "./bar.module.css"

function GuildBar({ user, userGuilds, guildID }) {

    const [guildsHolder, addtoGuildsHolder] = useState(userGuilds)
    const [guildCreateModal, setGuildCreateModal] = useState(null)
    const [guildJoinModal, setGuildJoinModal] = useState(null)

    useEffect(() => {
        let bootstrap = require('bootstrap/dist/js/bootstrap')
        setGuildCreateModal(new bootstrap.Modal(document.getElementById('createModal')))
        setGuildJoinModal(new bootstrap.Modal(document.getElementById('joinModal')))
    }, [])

    const ModalMethods = (modal, method) => {
        if (modal === "create") {
            switch (method) {
                case "toggle":
                    guildCreateModal.toggle()
                    break
                case "show":
                    guildCreateModal.show()
                    break
                case "hide":
                    guildCreateModal.hide()
                    break
            }
        }

        if (modal === "join") {
            switch (method) {
                case "toggle":
                    guildJoinModal.toggle()
                    break
                case "show":
                    guildJoinModal.show()
                    break
                case "hide":
                    guildJoinModal.hide()
                    break
            }
        }

    }

    return (
        <>
            <GuildCreateModal user={user} guildsHolderState={{ data: guildsHolder, set: addtoGuildsHolder }} modalMethods={ModalMethods} />
            <GuildJoinModal user={user} guildsHolderState={{ data: guildsHolder, set: addtoGuildsHolder }} modalMethods={ModalMethods} />

            <div className={`${css.guildBar}`}>
                <div className={`${css.menuContainer}`}>
                    <Link href={`/guild/`}>
                        <div className={`${css.menuIcon}`} style={{ backgroundImage: `url(/images/chopper)` }}></div>
                    </Link>
                </div>

                {
                    guildsHolder.map(guild => (
                        <Link key={guild.id} href={`/guild/${guild.id}`}>
                            <div className={`${css.guildIcon}`} style={{ backgroundImage: `url(${guild.iconURL})`, borderRadius: guildID == guild.id ? "15px" : "30px" }}></div>
                        </Link>
                    ))
                }
                <i className={`bi bi-plus ${css.plus}`} onClick={() => ModalMethods("create", "show")}></i>
                <button onClick={LibLogOut}>Logout</button>
            </div>
        </>
    )
}

export default GuildBar;