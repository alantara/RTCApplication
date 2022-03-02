//Next & React
import Link from "next/link";
import { useState } from "react";

//Custom
import GuildPopup from "./guildPopup";


function GuildBar({ loadGuilds, userID }) {
  
  const [popOpened, setPopOpened] = useState(false);
  const [newGuilds, setNewGuilds] = useState([]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-[color:var(--primary-bg-color)]">
      <Link href={`/guild`}>
        <div style={{ backgroundImage: `url(/d_images/nero.jpg)` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
      </Link>
      {
        loadGuilds.map(el => (
          <Link href={`/guild/${el.guildID}`}>
            <div style={{ backgroundImage: `url(${el.guildIcon})` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
          </Link>
        ))
      }
      {
        newGuilds?.map(el => (
          <Link href={`/guild/${el.guildID}`}>
            <div style={{ backgroundImage: `url(${el.guildIcon})` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
          </Link>
        ))
      }
      <div onClick={() => setPopOpened(true)} style={{ backgroundImage: `url(https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/plus-2-icon-11-256.png)` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
      <GuildPopup userID={userID} newGuilds={newGuilds} setNewGuilds={setNewGuilds} setPopOpened={setPopOpened} popOpened={popOpened} />
    </div>
  )
}

export default GuildBar;