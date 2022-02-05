const { io } = require("socket.io-client")
import { useState } from "react"
import { withSessionSsr } from "../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";

var socket = io()

export default function SsrProfile({
    user, data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    function Send() {
        if (document.getElementById("textbox").value == "") return;
        socket.emit('MessageSend', { message: document.getElementById("textbox").value, user: user.id, timestamp: Date.now() })
        document.getElementById("textbox").value = ""
        document.getElementById("textbox").focus()
    }

    function Message() {
        const [messageArray, setMessage] = useState([])

        socket.once('MessageReceived', (message) => {
            setMessage(messageArray.concat([message]))
        });

        return messageArray
    }

    function clear(timestamp) {
        socket.emit('ClearChat', timestamp)
    }

    socket.on('ClearChatReceived', (timestamp) => {
        var a = Array.from(document.getElementsByClassName(timestamp))
        a.map((el) => {
            el.remove()
        })
    });

    return (
        <>

            <input id="textbox"></input>
            <button onClick={Send}>Send</button>

            <ul>{
                data.map((e) => (<>
                    <li className={e.timestamp}>{`${e.author}:${e.messages} || ${e.timestamp}`}</li>
                    <button className={e.timestamp} onClickCapture={(e) => clear(e.currentTarget.className)}>Clear</button>
                </>
                ))
            }
            </ul>

            <ul>

                {Message().map((message) => (<>
                    <li className={message.timestamp}>{`${message.user}:${message.message} || ${message.timestamp}`}</li>
                    <button className={message.timestamp} onClick={(e) => clear(e.currentTarget.className)}>Clear</button>
                </>
                ))}
            </ul>
        </>)
}

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req.session.user;
        if (!user?.id) {
            return {
                props: {
                    user: false,
                },
            };
        }

        const knex = require('knex')({
            client: 'mysql',
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_DBNAME
            },
        });

        let data = await knex.select().from("messages")

        return {
            props: {
                user: req.session.user,
                data: JSON.parse(JSON.stringify(data))
            },
        };
    }
);