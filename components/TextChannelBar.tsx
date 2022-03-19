//Next & React
import Link from "next/link";

function ChannelBar({ guildData }) {

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
      body: JSON.stringify({ guildID: guildData.id, channelName: channelName, channelType: "text" })

    }).then((req) => {
      if (req.status == 200) {
        (event.target as HTMLInputElement).classList.add("d-none");;
        (event.target as HTMLInputElement).value = "";
      }
    })
  }

  return (
    <div className="h-100 p-2 d-flex flex-column gap-2">
      {
        guildData.channels?.map(el => (

          el.channelType != "text" ?
            <Link href={`/guild/${guildData.id}/${el.channelID}`}>
              <p style={{ cursor: "pointer" }}>{el.channelName}</p>
            </Link> :
            <></>
        ))
      }
      <input type="text" id="textChannelInput" className="w-100 d-none" onKeyDown={(event) => CreateTextChannel(event)} />
    </div>
  )
}

export default ChannelBar;