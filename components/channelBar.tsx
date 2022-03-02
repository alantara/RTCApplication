//Next & React
import Link from "next/link";
import { useState } from "react";

function ChannelBar({ cguild, channels, query }) {

  return (
    <div className="grid grid-rows-[50px_175px_auto] text-center bg-[color:var(--secondary-bg-color)]">
      <div className="h-[100%] bg-[color:var(--secondary-bg-color)]">

      </div>
      <div style={{ backgroundImage: `url(${cguild.guildBackground})` }} className="h-[100%] p-[15px_10px] bg-[#000]/25 bg-blend-darken grid grid-rows-2 justify-between bg-center bg-cover border-2 border-[color:var(--secondary-bg-color)]">
        <div style={{ backgroundImage: `url(${cguild.guildIcon})` }} className="h-[60px] w-[60px] bg-center bg-cover rounded-[10px] col-span-1"></div>
        <div className="col-start-2 col-end-4 flex flex-col justify-center">
          <h1 className="w-[100%_fit-content]">{cguild.guildName}</h1>
          <h1>{`ID: ${cguild.guildID}`}</h1>
        </div>
      </div>
      <div className="h-[100%] bg-[color:var(--secondary-bg-color)] p-[25px_5px] flex flex-col gap-[10px]">
        <li className="list-inside text-left text-[13px] text-[color:var(--secondary-tx-color)]">Text Channels</li>
        {
          channels?.map(el => (
            <Link href={`/guild/${query[0]}/${el.channelID}`}>
              <h2 className="cursor-pointer hover:text-[color:var(--secondary-tx-color)] duration-300 ease-in-out">{el.channelName}</h2>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default ChannelBar;