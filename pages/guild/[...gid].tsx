const { io } = require("socket.io-client")
import { useState } from "react"
import { withSessionSsr } from "../../lib/sessionHandler";
import { InferGetServerSidePropsType } from "next";
import style from "./chat.module.css"
import Link from "next/link";

var socket = io()

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req, query }) {
        const sessionData = req.session.data;
        if (!sessionData) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/auth/login"
                }
            };
        }

        let userGuilds = await fetch("http://localhost/api/guild/getUserGuilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ userID: req.session.data.user.id })

        })
        let guildsData = (await userGuilds.json()).guildsData

        let guildChannels = await fetch("http://localhost/api/guild/getGuildChannels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ guildID: query.gid[0] })

        })
        let channelList = (await guildChannels.json()).channels

        if (query.gid.length == 1) return {
            props: {
                query: query.gid,
                user: req.session.data.user,
                guilds: JSON.parse(JSON.stringify(guildsData)),
                channels: JSON.parse(JSON.stringify(channelList)),
            },
        }


        let channelMessages = await fetch("http://localhost/api/guild/getChannelMessages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ channelID: query.gid[1] })

        })
        let messages = (await channelMessages.json()).messages

        if (query.gid.length == 2) return {
            props: {
                query: query.gid,
                user: req.session.data.user,
                guilds: JSON.parse(JSON.stringify(guildsData)),
                channels: JSON.parse(JSON.stringify(channelList)),
                messages: JSON.parse(JSON.stringify(messages))
            },
        };


        if (query.gid.length > 2) return {
            redirect: {
                permanent: false,
                destination: `/${query.gid[0]}/${query.gid[1]}`
            }
        };

    }
);

export default function SsrProfile({
    query, user, guilds, channels, messages
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [messageList, setMessage] = useState([])

    socket.once("MessageReceived", (message) => {
        setMessage([...messageList, message])
    })
    socket.emit("JoinRoom", { room: query[1] })

    return (
        <>
            <div className={style.landingPage}>
                <div className={style.guildContainer}>
                    <Link href={`/guild`}>
                        <div className={style.guildIcon}><img src={"https://cdn.dribbble.com/users/1473783/screenshots/6076161/media/e35089e3c113fc063d6d3c0c655cf897.png?compress=1&resize=400x300&vertical=top"} alt="" /></div>
                    </Link>
                    {
                        guilds.map(el => (

                            <Link href={`/guild/${el.guildID}`}>
                                <div className={style.guildIcon}><img src={el.guildIcon} alt="" /></div>
                            </Link>
                        ))
                    }

                </div>
                <div className={style.channelContainer}>
                    {
                        channels?.map(el => (
                            <Link href={`/guild/${el.guildID}/${el.channelID}`}>
                                <h2>{el.channelName}</h2>
                            </Link>
                        ))
                    }
                    <div onClick={CreateChannelPopup} className={style.guildIcon}><img src="https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/plus-2-icon-11-256.png" alt="" /></div>
                    <div id="channelPopup" className={style.hidden}><input id="channelPopupInput" type="text" /><button onClick={CreateChannel}>Create</button></div>
                </div>
                <div className={style.blue}>
                    <div className={style.messages}>
                        {
                            messages ?
                                messages?.map(el => (
                                    <h2>{el.messageAuthorID + " " + el.messageText}</h2>
                                ))
                                :
                                <img src={guilds[0].guildBackground} alt="" />
                        }

                        {
                            <h2>{messageList?.map(el => (
                                <h2>{el}</h2>
                            ))}</h2>
                        }
                    </div>
                    {
                        messages ?
                            <div className={style.input}>
                                <input onKeyPress={Send} id="textbox" ></input>
                            </div>
                            :
                            <></>
                    }

                </div>
                <div className={style.channelContainer}></div>

            </div>
        </>
    )

    function CreateChannelPopup() {
        document.getElementById("channelPopup").classList.toggle(style.show)
    }

    function CreateChannel() {
        if (!document.getElementById("channelPopupInput").value) return
        fetch("/api/guild/channelCreate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ guildID: query[0], guildName: document.getElementById("channelPopupInput").value })

        }).then((req) => {
            if (req.status == 200) { }
        })
    }

    function Send(e) {
        if (e.key === "Enter") {
            if (document.getElementById("textbox").value == "") return;
            socket.emit('MessageSend', { message: document.getElementById("textbox").value, userID: user.id, channelID: query[1] })
            document.getElementById("textbox").value = ""
            document.getElementById("textbox").focus()
        }
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





    /* <input id="textbox"></input>
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
    </ul> */
}

