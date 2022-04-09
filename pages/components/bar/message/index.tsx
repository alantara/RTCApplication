//Next & React
import { useEffect, useState } from "react";
import css from "./bar.module.css"

const { io } = require("socket.io-client")
var socket = io()

function MessageBar({ user, currentGuild, currentChannel }) {

    const [messagesHolder, addtoMessagesHolder] = useState(currentChannel.messages)

    useEffect(() => {
        addtoMessagesHolder(currentChannel.messages)
    }, [currentChannel])

    socket.emit("text-channel-join", { room: currentChannel.id })

    function MessageSend(e) {
        if (e.key !== "Enter") return
        if (e.target.value == "") return;
        socket.emit('message-create', { text: e.target.value, userID: user.id, channelID: currentChannel.id })
        e.target.value = ""
        e.target.focus()
    }

    socket.once("message-created", (message) => {
        addtoMessagesHolder([...messagesHolder, message])
        let element = document.getElementById("messageContainer")
        element.scrollTop = element.scrollHeight;
    })

    function getUserInfo(el) {
        let a = currentGuild.members.filter((e) => { return e.id === el.authorID })
        return [a[0].avatar, a[0].username]
    }

    return (
        <div className={`col ${css.messageBar}`}>
            <div className={css.messageContainer} id="messageContainer">
                {messagesHolder.map((el, i) => {
                    let [avatar, username] = getUserInfo(el)
                    return (
                        <div key={i} className={css.message}>
                            <div className={css.messageAvatar}>
                                <img src={avatar} alt="avatar"/>
                            </div>
                            <div className={css.messageContent}>
                                <div className={css.messageAuthor}>
                                    <span>{username}</span>
                                </div>
                                <div className={css.messageText}>
                                    <span>{el.text}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={css.messageInput}>
                <input type="text" placeholder="Message" onKeyPress={MessageSend} />
            </div>
        </div>
    )
}

export default MessageBar;