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
    user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    React.useEffect(() => {

        socket.on("connect", () => {

            let peer = new Peer(socket.id)

            let video1 = document.getElementById("local-video")


            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    video1.srcObject = stream

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

            peer.on('open', id => {
                socket.emit('JoinRoom', { room: "test" })
                socket.emit("NewJoined", { id: id })

            })
        })
    })



    return (
        <>
            <Head>
                <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
            </Head>
            <video autoPlay id="remote-video" width={"800px"}></video>
            <video autoPlay muted id="local-video" width={"800px"}></video>
        </>
    )
}