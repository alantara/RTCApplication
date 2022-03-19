//Next & React
import Head from "next/head";
import { useEffect } from "react";

function ChannelBar({ guildData, socket }) {

  async function CreateVoiceChannel(event) {
    if (event.key != "Enter") return

    let channelName = (event.target as HTMLInputElement).value
    if (!channelName) return

    fetch("/api/channel/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ guildID: guildData.id, channelName: channelName, channelType: "voice" })

    }).then((req) => {
      if (req.status == 200) {
        (event.target as HTMLInputElement).style.display = "none";
        (event.target as HTMLInputElement).value = "";
      }
    })
  }

  function EnterChat(vChannelID) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {

        let peer = new Peer(socket.id)
        console.log(socket.id)
        socket.emit("voice-channel-join", { id: socket.id, room: vChannelID })

        peer.on("open", () => {

          let btn = document.getElementById("button")
          const box = document.getElementById(`box-${vChannelID}`);

          socket.on('voice-user-joined', ({ id }) => {
            const call = peer.call(id, stream)

            let video = CreateUser(call)

            call.on('stream', userVideoStream => {
              video.srcObject = userVideoStream
            })

            call.on('close', () => {
              video.remove()
            })

            call.on('error', (err) => {
              console.log(err)
            })

            btn.addEventListener("click", () => {
              call.close();
            })

          })

          peer.on('call', call => {
            call.answer(stream)

            let video = CreateUser(call)

            call.on('stream', userVideoStream => {
              video.srcObject = userVideoStream
            })

            call.on('close', () => {
              video.remove()
            })

            call.on('error', (err) => {
              console.log(err)
            })

            btn.addEventListener("click", () => {
              call.close();
            })

          })

          function CreateUser(call) {
            const video = document.createElement('video');
            video.autoplay = true;
            video.controls = false;
            video.muted = false;

            video.style.width = "100%"
            video.style.display = "block"
            video.id = call.peer

            box.appendChild(video)
            return video
          }


        })
      })
  }

  useEffect(() => {
    let btn = document.getElementById("button")

    btn.addEventListener("click", () => {
      socket.emit("voice-channel-disconnect", { id: socket.id })
    })

    socket.on("voice-user-disconnected", ({ id }) => {
      console.log(id)
      document.getElementById(id).remove()
    })
  })

  return (
    <>
      <Head>
        <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
      </Head>
      <div className="h-100 p-2 d-flex flex-column gap-2">
        {
          guildData.channels?.map(channel => {
            if (channel.channelType != "voice") return

            <div>
              <p style={{ cursor: "pointer" }} onClick={() => { EnterChat(channel.channelID) }}>{channel.channelName}</p>
              <div id={`box-${channel.channelID}`}></div>
            </div>
          })
        }
        <input type="text" id="voiceChannelInput" className="w-100 d-none" onKeyDown={(event) => CreateVoiceChannel(event)} />
        <input type="button" id="button" />
      </div>
    </>
  )

}

export default ChannelBar;