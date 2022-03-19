//Essentials
import { InferGetServerSidePropsType } from "next";
import { withSessionSsr } from "../../lib/sessionHandler";

//Custom Data Routes
import { GetUserGuilds } from "../api/guild/getFromUser"
import { GetGuildChannels } from "../api/guild/getGuildChannels"
import { getChannelMessages } from "../api/channel/getChannelMessages"
import { GetMembers } from "../api/guild/getMembers";

//Custom Layout
import GuildBar from "../../components/guildBar";
import TextChannelBar from "../../components/TextChannelBar";
import VoiceChannelBar from "../../components/VoiceChannelBar";
import MessageBar from "../../components/messageBar";


const { io } = require("socket.io-client")
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

        let connectedGuildID = query.gid[0]
        let connectedChannelID = query.gid[1]


        let userGuilds = (await GetUserGuilds(req.session.data.user.id)).json.userGuilds
        let currentGuild = userGuilds?.filter(guilds => { return guilds.guildID == connectedGuildID })[0]

        if (!currentGuild) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/guild"
                }
            };
        }

        let guildChannels = (await GetGuildChannels(parseInt(connectedGuildID))).json.guildChannels
        let guildMembers = (await GetMembers(parseInt(connectedGuildID))).json.guildMembers


        if (query.gid.length == 1) return {
            props: {
                user: req.session.data.user,
                userGuilds: JSON.parse(JSON.stringify(userGuilds)),
                currentGuild: {
                    data: JSON.parse(JSON.stringify(currentGuild)),
                    channels: JSON.parse(JSON.stringify(guildChannels)),
                    members: JSON.parse(JSON.stringify(guildMembers)),
                },
                currentChannel: null
            },
        }

        let channelMessages = (await getChannelMessages(parseInt(connectedChannelID))).json.channelMessages

        if (query.gid.length == 2) return {
            props: {
                user: req.session.data.user,
                userGuilds: JSON.parse(JSON.stringify(userGuilds)),
                currentGuild: {
                    data: JSON.parse(JSON.stringify(currentGuild)),
                    channels: JSON.parse(JSON.stringify(guildChannels)),
                    members: JSON.parse(JSON.stringify(guildMembers)),
                },
                currentChannel: {
                    id: JSON.parse(JSON.stringify(connectedChannelID)),
                    messages: JSON.parse(JSON.stringify(channelMessages))
                }
            },
        };


        if (query.gid.length > 2) return {
            redirect: {
                permanent: false,
                destination: `/${connectedGuildID}/${connectedChannelID}`
            }
        };

    }
);



export default function SsrProfile({
    user, userGuilds, currentGuild, currentChannel
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    //Channel
    function InputToggle(id) {
        let input = (document.getElementById(id) as HTMLInputElement)
        input.classList.contains("d-none") ? input.classList.remove("d-none") : input.classList.add("d-none")
    }


    if (currentChannel?.id) {
        socket.emit("text-channel-join", { room: currentChannel.id })
    }

    return (

        <div className="w-100 h-100 m-0 p-3 grid row overflow-hidden" style={{ backgroundColor: "var(--quaternary-black-bg)", backgroundImage: "url()", backgroundSize: "cover", backgroundPosition: "center" }}>

            <div className="py-4 d-flex flex-column align-items-center gap-2 rounded" style={{ width: "100px", backgroundColor: "var(--primary-black-bg-90)" }}>
                <GuildBar userGuilds={userGuilds} user={user} />
            </div>

            <div className="p-0 d-flex flex-column" style={{ width: "440px" }}>
                <div className="h-25 m-2 mt-0 p-0 row rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>

                    <div className="p-0 rounded" style={{ backgroundImage: `url(${currentGuild.data.guildBackground})`, backgroundPosition: "center", backgroundSize: "cover" }}>
                        <div className="w-100 h-100 p-2" style={{ background: "#00000050" }}>
                            <div className="rounded" style={{ width: "80px", height: "80px", backgroundImage: `url(${currentGuild.data.guildIcon})`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
                            <h2>{currentGuild.data.guildName}</h2>
                        </div>
                    </div>

                </div>
                <div className="h-75 m-0 p-0 row">
                    <div className="m-2 mb-0 p-2 col rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>
                        <ul className="border-bottom">
                            <li>Text Channels <i className="bi bi-plus" style={{ cursor: "pointer" }} onClick={() => { InputToggle("textChannelInput") }}></i></li>
                        </ul>
                        <TextChannelBar guildData={currentGuild} />
                    </div>
                    <div className="m-2 mb-0 p-2 col rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }}>
                        <ul className="border-bottom">
                            <li>Voice Channels <i className="bi bi-plus" style={{ cursor: "pointer" }} onClick={() => { InputToggle("voiceChannelInput") }}></i></li>
                        </ul>
                        <VoiceChannelBar guildData={currentGuild} socket={socket} />
                    </div>
                </div>
            </div>

            <div className="h-100 m-0 p-0 col d-flex flex-column rounded" style={{ backgroundColor: "var(--primary-black-bg-90)" }} >
                {
                    currentChannel ?
                        <MessageBar socket={socket} currentChannel={currentChannel} user={user} currentGuild={currentGuild} />
                        :
                        <></>
                }
            </div>

        </div>
    )



}


// const voiceChannel = useState("")

// const [popOpened, setPopOpened] = useState(false);
// const [newGuilds, setNewGuilds] = useState([]);

// const [popPage, setPopPage] = useState("create");
// const [guildIcon, setGuildIcon] = useState(null);
// const [guildBackground, setGuildBackground] = useState(null);
// const [btnDisabled, setBtnDisabled] = useState(false)

// const notifications = useNotifications();

// //Mantine Form System
// const createGuildForm = useForm({
//     initialValues: {
//         guildName: '',
//     },
//     validationRules: {
//         guildName: (guildName) => ParseName(guildName)
//     },
//     errorMessages: {
//         guildName: "Invalid guildName.",
//     }
// });

// async function CreateGuild(values) {

//     if (!values.guildName || !guildIcon || !guildBackground) {
//         setBtnDisabled(false);
//         return notifications.showNotification({
//             title: 'Guild Creation Failed',
//             message: 'Make sure to add ALL atributes.',
//             color: 'red',
//             disallowClose: true,
//         })
//     }

//     const body = new FormData();
//     body.append("guildName", values.guildName);
//     body.append("guildIcon", guildIcon);
//     body.append("guildBackground", guildBackground);

//     //ImageUpload Request
//     let imgUp = await fetch("./imageUpload", {
//         method: "POST",
//         headers: {
//             'Access-Control-Allow-Origin': '*'
//         },
//         body: body
//     })
//     if (imgUp.status !== 201) {
//         setBtnDisabled(false);
//         return notifications.showNotification({
//             title: 'Image API Failed',
//             message: 'Try again or contact the creator',
//             color: 'red',
//             disallowClose: true,
//         })
//     }

//     let filenames = await imgUp.json()

//     //GuildCreation Request
//     let guildCreate = await fetch("/api/guild/create", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         },
//         body: JSON.stringify({
//             userID: user.id,
//             guildName: filenames.guildName,
//             guildImage: `/images/${filenames.guildIconFilename}`,
//             guildBackground: `/images/${filenames.guildBackgroundFilename}`,
//         })
//     })
//     if (guildCreate.status !== 201) {
//         setBtnDisabled(false);
//         return notifications.showNotification({
//             title: 'Guild Creation Failed',
//             message: 'Something went wrong! Contact the creator.',
//             color: 'red',
//             disallowClose: true,
//         })
//     }

//     setNewGuilds([...newGuilds, { guildIcon: `/images/${filenames.guildIconFilename}`, guildID: (await guildCreate.json()).id }])
//     setPopOpened(false)
//     setPopPage("create")
//     setBtnDisabled(false)
//     setGuildBackground(null)
//     setGuildIcon(null)
// }

// socket.emit("ExitAllRooms")

// if (query[1]) {
//     socket.emit("JoinRoom", { room: query[1] })
// }

// const [messageList, setMessage] = useState([])

// socket.once("MessageReceived", (message) => {
//     setMessage([...messageList, { messageText: message.text, messageID: message.id, messageAuthorID: message.author }])
//     let element = document.getElementById("messageContainer")
//     element.scrollTop = element.scrollHeight;
// })

// function y(memberList, el) {
//     let a = memberList.filter((e) => { return e.userID == el.messageAuthorID })
//     return [a[0].profileImage, a[0].accountUsername]
// }

// function CreateChannel() {
//     //if (!document.getElementById("channelPopupInput").value) return
//     fetch("/api/channel/create", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         },
//         body: JSON.stringify({ guildID: query[0], channelName: "oi" })

//     }).then((req) => {
//         if (req.status == 200) { }
//     })
// }

// function MessageSend(e) {
//     if (e.key === "Enter") {
//         if (e.target.value == "") return;
//         socket.emit('MessageSend', { message: e.target.value, userID: user.id, channelID: query[1] })
//         e.target.value = ""
//         e.target.focus()
//     }
// }

// socket.on("connect", () => {

//     socket.emit('JoinRoom', { room: "test" })

//     let peer = new Peer(socket.id)

//     let button = document.getElementById("button")

//     button.addEventListener("click", () => {
//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then(stream => {
//                 socket.emit("NewJoined", { id: socket.id })

//                 const box = document.getElementById('box');

//                 socket.on('NewJoined', ({ id }) => {
//                     const call = peer.call(id, stream)

//                     const video = document.createElement('video');
//                     video.autoplay = true;
//                     video.controls = true;
//                     video.muted = false;

//                     box.appendChild(video)

//                     call.on('stream', userVideoStream => {
//                         video.srcObject = userVideoStream
//                     })

//                     call.on('disconnect', () => {
//                         console.log("oi2")

//                         video.remove()
//                     })
//                 })
//                 peer.on('call', call => {
//                     call.answer(stream)

//                     const video = document.createElement('video');
//                     video.autoplay = true;
//                     video.controls = true;
//                     video.muted = false;

//                     box.appendChild(video)

//                     call.on('stream', userVideoStream => {
//                         video.srcObject = userVideoStream
//                     })

//                     call.on('disconnect', () => {
//                         console.log("oi")
//                         video.remove()
//                     })
//                 })



//             })
//     })
// })


{/* <Head>
            <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
        </Head>

        <div className="h-100 w-100 m-0 p-0 grid row">

            <div className="h-100 d-flex flex-column gap-2 align-items-center justify-content-center" style={{ width: "75px", backgroundColor: `var(--primary-bg-color)` }}>
                <Link href={`/guild`}>
                    <div className="rounded-circle" style={{ width: "60px", height: "60px", backgroundImage: `url(/d_images/nero.jpg)`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
                </Link>
                {
                    loadGuilds.map(el => (
                        <Link href={`/guild/${el.guildID}`}>
                            <div className="rounded-circle" style={{ width: "60px", height: "60px", backgroundImage: `url(${el.guildIcon})`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
                        </Link>
                    ))
                }
                {
                    newGuilds?.map(el => (
                        <Link href={`/guild/${el.guildID}`}>
                            <div className="rounded-circle" style={{ width: "60px", height: "60px", backgroundImage: `url(${el.guildIcon})`, backgroundPosition: "center", backgroundSize: "cover" }}></div>
                        </Link>
                    ))
                }
            </div>

            <div className="h-100" style={{ width: "225px", backgroundColor: `var(--secondary-bg-color)` }}>

            </div>

            <div className="col h-100 bg-auto" style={{ backgroundColor: `var(--terciary-bg-color)` }}>

            </div>

            <div className="h-100" style={{ width: "250px" }}>

            </div>
        </div>

        <div className="grid h-full grid-cols-[75px_225px_auto_250px]">

            <div className="flex flex-col items-center justify-center gap-2 bg-[color:var(--primary-bg-color)]">
                <Link href={`/guild`}>
                    <div style={{ backgroundImage: `url(/d_images/nero.jpg)` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
                </Link>
                {
                    loadGuilds.map(el => (
                        <Link href={`/guild/${el.guildID}`}>
                            <div style={{ backgroundImage: `url(${el.guildIcon})` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
                        </Link>
                    ))
                }
                {
                    newGuilds?.map(el => (
                        <Link href={`/guild/${el.guildID}`}>
                            <div style={{ backgroundImage: `url(${el.guildIcon})` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
                        </Link>
                    ))
                }
                <div onClick={() => setPopOpened(true)} style={{ backgroundImage: `url(https://iconsplace.com/wp-content/uploads/_icons/ffa500/256/png/plus-2-icon-11-256.png)` }} className="w-[60px] h-[60px] cursor-pointer rounded-[50%] hover:rounded-[25%] ease-in-out duration-[250ms] bg-[color:var(--secondary-bg-color)] bg-cover bg-center"></div>
                <Modal
                    opened={popOpened}
                    onClose={() => { setPopOpened(false); setPopPage("create"); setGuildIcon(null); setGuildBackground(null) }}
                    title={popPage == "create" ? "Create a Guild" : "Join a Guild"}
                    size={700}
                    centered
                >
                    {
                        popPage == "create" ?
                            <div>
                                <div style={{ backgroundImage: guildBackground ? `url(${URL.createObjectURL(guildBackground)})` : "none" }} className="w-[100%] h-[100%] bg-cover bg-center">
                                    <form onSubmit={createGuildForm.onSubmit((values) => { setBtnDisabled(true); CreateGuild(values) })}>
                                        <div className="flex gap-5 content-center py-10 px-10">
                                            <TextInput id="guildName" className="flex-1"
                                                styles={{
                                                    root: {
                                                        alignSelf: "center",
                                                    },
                                                    input: {
                                                        fontSize: "35px",
                                                        height: "80px",
                                                    },
                                                    error: {
                                                        fontSize: "12px",
                                                    }
                                                }}
                                                variant="unstyled"
                                                placeholder="MySuperGuildName"
                                                {...createGuildForm.getInputProps('guildName')}
                                            />
                                            <Dropzone
                                                onDrop={(files) => { setGuildIcon(files[0]) }}
                                                onReject={(files) => console.log('rejected files', files)}
                                                maxSize={3 * 1024 ** 2}
                                                accept={["image/png", "image/jpg", "image/jpeg"]}
                                                className="w-[100px] h-[100px] rounded-[50px] bg-cover bg-center"
                                                style={{ backgroundImage: guildIcon ? `url(${URL.createObjectURL(guildIcon)})` : "none" }}
                                            >
                                                {(status) => (
                                                    guildIcon ?
                                                        <></>
                                                        :
                                                        <div className="flex justify-center">
                                                            <h1 className="">Guild Icon</h1>
                                                        </div>
                                                )}
                                            </Dropzone>
                                        </div>
                                        <Dropzone
                                            onDrop={(files) => { setGuildBackground(files[0]) }}
                                            onReject={(files) => console.log('rejected files', files)}
                                            maxSize={3 * 1024 ** 2}
                                            accept={["image/png", "image/jpg", "image/jpeg"]}
                                            className="w-[100%] h-[150px]"
                                            style={{ opacity: guildBackground ? .25 : 1 }}
                                        >
                                            {(status) => (<>
                                                {
                                                    guildBackground ?
                                                        <></>
                                                        :
                                                        <div className="flex justify-center">
                                                            <h1 className="">Guild Background</h1>
                                                        </div>
                                                }
                                            </>
                                            )}
                                        </Dropzone>
                                        <Button disabled={btnDisabled} className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" type="submit">Create Guild</Button>
                                    </form>
                                </div>

                                <Button className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" onClick={() => { setPopPage("join"); setGuildIcon(null), setGuildBackground(null) }}>Join Guild</Button>
                            </div>
                            :
                            <div>
                                <Button className="w-[40%] h-[40px] mx-[30%] my-5 place-content-center bg-[color:var(--secondary-tx-colorized)] hover:bg-[color:var(--terciary-tx-colorized)] duration-200 rounded-[15px]" onClick={() => { setPopPage("create") }}>Join Guild</Button>
                            </div>
                    }
                </Modal>
            </div>
            <div className="grid grid-rows-[50px_175px_auto] text-center bg-[color:var(--secondary-bg-color)]">
                <div className="h-[100%] bg-[color:var(--secondary-bg-color)]">

                </div>
                <div style={{ backgroundImage: `url(${cguild.guildBackground})` }} className="h-[100%] p-[15px_10px] bg-[#000]/25 bg-blend-darken grid grid-rows-2 justify-between bg-center bg-cover border-2 border-[color:var(--secondary-bg-color)]">
                    <div style={{ backgroundImage: `url(${cguild.guildIcon})` }} className="h-[60px] w-[60px] bg-center bg-cover rounded-[10px] col-span-1"></div>
                    <div className="col-start-2 col-end-4 flex flex-col justify-center">
                        <h1 className="w-[100%_fit-content]">{cguild.guildName}</h1>
                        <h1>{`ID: ${cguild.guildID}`}</h1>
                    </div>
                </div>
                <div className="h-[100%] bg-[color:var(--secondary-bg-color)] p-[25px_5px] flex flex-col gap-[10px]">
                    <li className="list-inside text-left text-[13px] text-[color:var(--secondary-tx-color)]">Text Channels</li>
                    {
                        channels?.map(el => (
                            <Link href={`/guild/${query[0]}/${el.channelID}`}>
                                <h2 className="cursor-pointer hover:text-[color:var(--secondary-tx-color)] duration-300 ease-in-out">{el.channelName}</h2>
                            </Link>
                        ))
                    }
                </div>
            </div>
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
            <div className="p-[40px_0] flex flex-col align-middle bg-[color:var(--terciary-bg-color)]">
                <button id="button">Click</button>
                <div id="box"></div>
            </div>
        </div> */}


