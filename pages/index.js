const { io } = require("socket.io-client")
import { useState } from "react"

var socket = io()

const send = function send() {
    socket.emit('message', "Button Pressed")
}



export default function Home({ }) {

    const [array, setArray] = useState([])

    socket.on('message', (arg) => {
        setArray(array.concat([arg]))
        console.log(arg);
        console.log(array);
    });

    return (
        <>
            <button onClick={send}> Hey</button>
            <ul>
                {array}
            </ul>
        </>)
}