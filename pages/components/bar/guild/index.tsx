//Next & React
import Link from "next/link";
import { useState } from "react";

//Modals
import GuildCreateModal from "../../modals/guild/create";
import GuildJoinModal from "../../modals/guild/join";

//CSS
import css from "./bar.module.css"

function GuildBar({ user, userGuilds, guildID }) {

    const [guildsHolder, addtoGuildsHolder] = useState(userGuilds)

    return (
        <>
            <GuildCreateModal user={user} guildsHolderState={{ guildsHolder, addtoGuildsHolder }} />
            <GuildJoinModal user={user} guildsHolderState={{ guildsHolder, addtoGuildsHolder }} />

            <div className={`${css.guildBar}`}>
                <div className={`${css.menuContainer}`}>
                    <Link href={`/guild/`}>
                        <div className={`${css.menuIcon}`} style={{ backgroundImage: `url(/images/chopper)` }}></div>
                    </Link>
                </div>

                {
                    guildsHolder.map(guild => (
                        <Link href={`/guild/${guild.id}`}>
                            <div className={`${css.guildIcon}`} style={{ backgroundImage: `url(${guild.iconURL})`, borderRadius: guildID == guild.id ? "15px" : "30px" }}></div>
                        </Link>
                    ))
                }
                <i className={`bi bi-plus ${css.plus}`} data-bs-toggle="modal" data-bs-target="#createModal"></i>
            </div>
        </>
    )
}

export default GuildBar;