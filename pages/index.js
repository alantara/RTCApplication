const { io } = require("socket.io-client")
import { useState } from "react"

var socket = io()

const send = function send() {
    socket.emit('MessageSend', document.getElementById("textbox").value)
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

export default function Home({ }) {
    return (
        <>
            <input id="textbox"></input>
            <button onClick={send}> Hey</button>
            <ul>
                {Message().map((message) => (
                    <li>{message}</li>
                ))}
            </ul>
        </>)
}