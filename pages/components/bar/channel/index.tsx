//Next & React
import Link from "next/link";
import { useEffect, useState } from "react";
import { LibChannelCreate } from "../../../../lib/channel/create";
import css from "./bar.module.css"

const { io } = require("socket.io-client")
var socket = io()

function ChannelBar({ currentGuild }) {

    const [channelsHolder, addtoChannelsHolder] = useState(currentGuild.channels)

    useEffect(() => {
        addtoChannelsHolder(currentGuild.channels)
    }, [currentGuild])

    async function CreateChannel(event) {
        if (event.key !== "Enter") return

        let channelName = (event.target as HTMLInputElement).value
        if (!channelName) return

        let req = await LibChannelCreate(channelName, currentGuild.data.id, "text")
        if (req.status === 200) {
            (event.target as HTMLInputElement).classList.add("d-none");;
            (event.target as HTMLInputElement).value = "";
            addtoChannelsHolder([...channelsHolder, (await req.json()).CREATE_CHANNEL[0]]);
        }
    }

    function ShowInput() {
        let classList = (document.getElementById("channelInput") as HTMLInputElement).classList;
        classList.toggle("d-none");
    }



    useEffect(() => {
        socket.on("connect", async () => {

            socket.emit("voice-room")

            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

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
                    socket.emit("candidate", { data: event.candidate })

                    socket.on('new-candidate', async ({ data }) => {
                        if (data.candidate) {
                            await peerConnection.addIceCandidate(data)
                        }
                    })
                }
            });

            peerConnection.addEventListener('connectionstatechange', event => {
                console.log(peerConnection.connectionState)
            });

            const remoteVideo = document.querySelector('#remoteVideo');
            peerConnection.addEventListener('track', async (event) => {
                (remoteVideo as HTMLVideoElement).srcObject = event.streams[0];
            });

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });



            socket.emit("seek-offer", { seekerID: socket.id })

            socket.once("found-offer", async ({ seekerID }) => {
                const offer = await peerConnection.createOffer();
                socket.emit("offer", { offer: offer, to: seekerID, offererID: socket.id })
                await peerConnection.setLocalDescription(offer);

                socket.on("send-answer", async ({ answer }) => {
                    console.log("sent answer")
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                })
            })

            socket.on("send-offer", async ({ offer, offererID }) => {
                console.log("sent offer")
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit("answer", { answer: answer, to: offererID })
            })

        })
    })

    return (
        <>
            <div className={css.channelBar}>
                <div className={css.channelTitle}>
                    <h1>{currentGuild.data.name}</h1>
                </div>
                <div className={css.channelTitle2}>
                    <h6>Channels</h6>
                    <i className={`bi bi-plus lh-1 ${css.plus}`} onClick={ShowInput}></i>
                </div>
                <div className={`${css.channelContainer}`}>
                    {
                        channelsHolder?.map(el => {
                            if (el.type === "voice") return <>
                                <div className={css.channel}>
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
                    <audio src="" id="remoteVideo" autoPlay controls></audio>
                </div>

                <input type="text" id="channelInput" className="w-100 d-none" onKeyDown={(event) => CreateChannel(event)} />
            </div>
        </>
    )
}

export default ChannelBar;