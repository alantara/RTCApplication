//Next & React
import { TextInput } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
const { io } = require("socket.io-client")
var socket = io()

function MessageBar({ messages, memberList, query, user }) {

  socket.emit("ExitAllRooms")

    if (query[1]) {
        socket.emit("JoinRoom", { room: query[1] })
    }

    const [messageList, setMessage] = useState([])

    socket.once("MessageReceived", (message) => {
        setMessage([...messageList, { messageText: message.text, messageID: message.id, messageAuthorID: message.author }])
        let element = document.getElementById("messageContainer")
        element.scrollTop = element.scrollHeight;
    })

  function y(memberList, el) {
    let a = memberList.filter((e) => { return e.userID == el.messageAuthorID })
    return [a[0].profileImage, a[0].accountUsername]
  }

  function CreateChannel() {
    //if (!document.getElementById("channelPopupInput").value) return
    fetch("/api/channel/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ guildID: query[0], channelName: "oi" })

    }).then((req) => {
      if (req.status == 200) { }
    })
  }

  function MessageSend(e) {
    if (e.key === "Enter") {
      if (e.target.value == "") return;
      socket.emit('MessageSend', { message: e.target.value, userID: user.id, channelID: query[1] })
      e.target.value = ""
      e.target.focus()
    }
  }

  return (
    <div className="grid h-full grid-rows-[auto_75px]">
      <div id="messageContainer" className="p-[40px_0] flex flex-col align-middle bg-[color:var(--quaternary-bg-color)] gap-10 overflow-y-scroll max-h-[calc(100vh-75px)]">
        {
          messages?.map(el => (
            <div className="grid grid-cols-[50px_auto]">
              <div style={{ backgroundImage: `url(${y(memberList, el)[0]})` }} className="bg-cover bg-center h-[50px] w-[50px]"></div>
              <div className="flex flex-col align-middle text-left">
                <h3>{y(memberList, el)[1]}</h3>
                <p>{el.messageText}</p>
              </div>
            </div>
          ))
        }
        {
          messageList?.map(el => (
            <div className="grid grid-cols-[50px_auto]">
              <div style={{ backgroundImage: `url(${y(memberList, el)[0]})` }} className="bg-cover bg-center h-[50px] w-[50px]"></div>
              <div className="flex flex-col align-middle text-left">
                <h3>{y(memberList, el)[1]}</h3>
                <p>{el.messageText}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className="h-[100%] p-[10px_20px] bg-[color:var(--terciary-bg-color)] flex flex-col-reverse justify-center align-middle">
        <TextInput
          className="w-[100%] justify-center align-middle"
          onKeyDown={MessageSend}
          required
        />
        <button onClick={CreateChannel}>OI</button>
      </div>
    </div>
  )
}

export default MessageBar;