//Next & React
import Link from "next/link";
import { useState } from "react";

function ChannelBar({ channels, query }) {

  async function CreateTextChannel(event) {
    if (event.key != "Enter") return

    let channelName = (event.target as HTMLInputElement).value
    if (!channelName) return

    fetch("/api/channel/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ guildID: query[0], channelName: channelName, channelType: "text" })

    }).then((req) => {
      if (req.status == 200) {
        (event.target as HTMLInputElement).style.display = "none";
        (event.target as HTMLInputElement).value = "";
      }
    })
  }

  return (
    <div className="h-100 p-2 d-flex flex-column gap-2">
      {
        channels?.map(el => (
          el.channelType == "text" ?
            <Link href={`/guild/${query[0]}/${el.channelID}`}>
              <p style={{cursor:"pointer"}}>{el.channelName}</p>
            </Link> :
            <></>
        ))
      }
      <input type="text" id="textInput" className="w-100" style={{ display: "none" }} onKeyDown={(event) => CreateTextChannel(event)} />
    </div>
  )
}

export default ChannelBar;