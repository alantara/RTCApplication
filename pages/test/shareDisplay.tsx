//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

import * as React from "react";
const { io } = require("socket.io-client")
var socket = io()
import Head from 'next/head'

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps() {

        return {
            props: {

            },
        }
    }
);

export default function SsrProfile({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    React.useEffect(() => {

        socket.on("connect", () => {

            let peer = new Peer(socket.id)

            let video1 = document.getElementById("local-video")

            let button = document.getElementById("button")

            button.addEventListener("click", () => {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(stream => {
                        video1.srcObject = stream

                        socket.emit("NewJoined", { id: socket.id })

                        socket.on('NewJoined', ({ id }) => {
                            const call = peer.call(id, stream)

                            const video2 = document.getElementById('remote-video')
                            call.on('stream', userVideoStream => {
                                console.log(userVideoStream)

                                video2.srcObject = userVideoStream
                            })
                        })
                        peer.on('call', call => {
                            call.answer(stream)

                            const video2 = document.getElementById('remote-video')
                            call.on('stream', userVideoStream => {
                                console.log(userVideoStream)
                                video2.srcObject = userVideoStream
                            })
                        })



                    })
            })



            peer.on('open', id => {
                socket.emit('JoinRoom', { room: "test" })

            })
        })
    })



    return (
        <>
            <Head>
                <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
            </Head>
            <button id="button">Click!</button>
            <video autoPlay id="remote-video" width={"800px"}></video>
            <video autoPlay muted id="local-video" width={"800px"}></video>
        </>
    )
}