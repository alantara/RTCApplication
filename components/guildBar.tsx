//Next & React
import Link from "next/link";
import { useState } from "react";
import GuildCreateModal from "./guildCreateModal";
import GuildJoinModal from "./guildJoinModal";

function GuildBar({ userGuilds, user }) {

  const [newGuilds, setNewGuilds] = useState([]);

  return (
    <>
      <GuildCreateModal newGuilds={newGuilds} setNewGuilds={setNewGuilds} user={user} />
      <GuildJoinModal />

      <Link href={`/guild`}>
        <div
          className="rounded-circle"
          style={{ width: "60px", height: "60px", cursor: "pointer", backgroundImage: `url(/d_images/moon.png)`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
        </div>
      </Link>
      {
        userGuilds.map(userGuild => (
          <Link href={`/guild/${userGuild.guildID}`}>
            <div
              className="rounded-circle"
              style={{ width: "60px", height: "60px", cursor: "pointer", backgroundImage: `url(${userGuild.guildIcon})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
            </div>
          </Link>
        ))
      }
      {
        newGuilds?.map(newGuild => (
          <Link href={`/guild/${newGuild.guildID}`}>
            <div
              className="rounded-circle"
              style={{ width: "60px", height: "60px", cursor: "pointer", backgroundImage: `url(${newGuild.guildIcon})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
            </div>
          </Link>
        ))
      }
      <button type="button" className="btn p-0 rounded-circle d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#createModal" style={{ width: "60px", height: "60px", cursor: "pointer" }}>
        <i className="bi bi-plus lh-1" style={{ width: "50px", height: "50px", fontSize: "50px", color: "var(--primary-tx-color)" }}></i>
      </button>
    </>
  )
}

export default GuildBar;