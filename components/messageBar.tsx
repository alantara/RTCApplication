//Next & React
import { useState } from "react";

function MessageBar({ socket, currentChannel, user, currentGuild }) {

    const [messageList, setMessage] = useState([])

    function MessageSend(e) {
        if (e.key === "Enter") {
            if (e.target.value == "") return;
            socket.emit('message-create', { message: e.target.value, userID: user.id, channelID: currentChannel.id })
            e.target.value = ""
            e.target.focus()
        }
    }

    socket.once("message-created", (message) => {
        setMessage([...messageList, { messageText: message.text, messageID: message.id, messageAuthorID: message.author }])
        let element = document.getElementById("messageContainer")
        element.scrollTop = element.scrollHeight;
    })

    function getUserInfo(memberList, el) {
        let a = memberList.filter((e) => { return e.userID == el.messageAuthorID })
        return [a[0].profileImage, a[0].accountUsername]
    }

    return (
        <div>
            <div id="messageContainer" className="p-2 d-flex flex-column align-items-middle gap-10 overflow-y-scroll max-h-[calc(100vh-75px)]" style={{ overflow: "auto" }}>
                {
                    currentChannel.messages?.map(el => (
                        <div className="d-flex flex-column">
                            <div style={{ backgroundImage: `url(${getUserInfo(currentGuild.members, el)[0]})`, backgroundPosition: "center", backgroundSize: "cover", height: "50px", width: "50px" }}></div>
                            <div className="flex flex-column align-items-middle text-left">
                                <h3>{getUserInfo(currentGuild.members, el)[1]}</h3>
                                <p>{el.messageText}</p>
                            </div>
                        </div>
                    ))
                }
                {
                    messageList?.map(el => (
                        <div className="d-flex flex-column">
                            <div style={{ backgroundImage: `url(${getUserInfo(currentGuild.members, el)[0]})`, backgroundPosition: "center", backgroundSize: "cover", height: "50px", width: "50px" }}></div>
                            <div className="flex flex-column align-items-middle text-left">
                                <h3>{getUserInfo(currentGuild.members, el)[1]}</h3>
                                <p>{el.messageText}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="h-[100%] p-[10px_20px] bg-[color:var(--terciary-bg-color)] flex flex-col-reverse justify-center align-middle">
                <input type="text" onKeyDown={(e) => { MessageSend(e) }} />
            </div>
        </div>
    )
}

export default MessageBar;