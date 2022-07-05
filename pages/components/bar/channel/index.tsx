//Next & React
import Link from "next/link";
import { useEffect, useState } from "react";
import { LibChannelCreate } from "../../../../lib/channel/create";
import css from "./bar.module.css"

function ChannelBar({ currentGuild, clientSocket, userID }) {

    const [channelsHolder, addtoChannelsHolder] = useState(currentGuild.channels)
    const [newChannel, setNewChannel] = useState("")

    useEffect(() => {
        addtoChannelsHolder(currentGuild.channels)
    }, [currentGuild])

    async function CreateChannel(event) {
        if (event.key !== "Enter") return
        if (!newChannel) return

        let type = newChannel.slice(0, 1)
        let channelName = newChannel.slice(1)

        // let req = await LibChannelCreate(newChannel, currentGuild.data.id, "text")
        // if (req.status === 200) {
        //     (event.target as HTMLInputElement).classList.add("d-none");;
        //     (event.target as HTMLInputElement).value = "";
        //     addtoChannelsHolder([...channelsHolder, (await req.json()).CREATE_CHANNEL[0]]);
        // }
    }

    function ShowInput() {
        let classList = (document.getElementById("channelInput") as HTMLInputElement).classList;
        classList.toggle("d-none");
    }

    const peerConnect = async () => {
        const configuration = {
            'iceServers': [
                {
                    urls: 'stun:stun.l.google.com:19302'
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ],
            offerToReceiveAudio: true,
            offerToReceiveVideo: false
        }

        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
                clientSocket.emit("candidate", { data: event.candidate })

                clientSocket.on('new-candidate', async ({ data }) => {
                    if (data.candidate) {
                        await peerConnection.addIceCandidate(data)
                    }
                })
            }
        });

        return peerConnection;
    }

    const voiceChannelJoin = async (channelID) => {

        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const peerConnection = await peerConnect()

        peerConnection.addEventListener('track', async (event) => {
            const remoteVideo = document.createElement('audio');
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.controls = true;
            document.body.appendChild(remoteVideo);
        });

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        clientSocket.on("seek-offer", async ({ seekerID }) => {
            console.log("seek-offer")
            const offer = await peerConnection.createOffer();
            clientSocket.emit("offer-send", { offer: offer, seekerID: seekerID, offererID: userID })
            await peerConnection.setLocalDescription(offer);

            clientSocket.on("answer", async ({ answer }) => {
                console.log("answer")
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            })
        })

        clientSocket.on("offer", async ({ offer, offererID }) => {
            console.log("offer")
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            clientSocket.emit("answer-send", { answer: answer, offererID: offererID })
        })

        clientSocket.emit("voice-channel-join", { channelID: channelID, userID: userID })
    }

    return (
        <div className={css.channelBar}>
            <div className={css.channelTitle}>
                <h1>{currentGuild.data.name}</h1>
                <p>ID: {currentGuild.data.id}</p>
            </div>
            <div className={css.channelTitle2}>
                <h6>Channels</h6>
                <i className={`bi bi-plus lh-1 ${css.plus}`} onClick={ShowInput}></i>
            </div>
            <div className={`${css.channelContainer}`}>
                {
                    channelsHolder?.map(el => {
                        if (el.type === "voice") return <>
                            <div className={css.channel} onClick={() => voiceChannelJoin(el.id)}>
                                <i className="bi bi-volume-up"></i>
                                <p>{el.name}</p>
                            </div>
                        </>;

                        if (el.type === "text") return <>
                            <Link href={`/guild/${currentGuild.data.id}/${el.id}`}>
                                <div className={css.channel}>
                                    <i className="bi bi-chat-dots"></i>
                                    <p>{el.name}</p>
                                </div>
                            </Link>
                        </>;
                    }
                    )
                }
            </div>

            <input type="text" id="channelInput" className={`d-none ${css.input}`} onKeyDown={(event) => CreateChannel(event)} onChange={(e) => setNewChannel(e.target.value)} />
        </div>
    )
}

export default ChannelBar;