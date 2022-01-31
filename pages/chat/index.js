const { io } = require("socket.io-client")
import { useState } from "react"

var socket = io()

function Send() {
    if (document.getElementById("textbox").value == "") return;
    socket.emit('MessageSend', { message: document.getElementById("textbox").value, user: document.getElementById("user").value, timestamp: Date.now() })
    document.getElementById("textbox").value = ""
    document.getElementById("textbox").focus()
}

export function Message() {
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

export default function Home({ data }) {
    return (
        <>

            <input id="textbox"></input>
            <input id="user"></input>
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

export async function getServerSideProps() {

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

    return { props: { data: JSON.parse(JSON.stringify(data)) } }
}