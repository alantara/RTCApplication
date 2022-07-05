//Server Imports
const app = require("express")();
const httpServer = require("http").Server(app);

const { Server } = require("socket.io");
const ioSocket = new Server(httpServer);

//Server Variables
require('dotenv').config()
const fs = require("fs")

const port = 3000
global.hostname = process.env.HOST_HOSTNAME ? `${process.env.HOST_HOSTNAME}:${port}` : `http://localhost:${port}`

//Next Configuration
const next = require("next")
const nextApp = next({ dev: process.env.NODE_ENV === "development" })
const nextHandler = nextApp.getRequestHandler();

//Database Configuration
const { createClient } = require("@supabase/supabase-js");
global.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

//Routing (Next.js)
nextApp.prepare().then(() => {

    app.get('/images/:file(*)', (req, res) => {
        let file = req.params.file;
        const fileTypes = ["gif", "jpg", "png", "jpeg"]

        let extensionedFile = `${process.cwd()}/ImageDir/${file}`
        if (fs.existsSync(extensionedFile)) return res.sendFile(extensionedFile)

        for (let type of fileTypes) {
            let nonextensionedFile = `${process.cwd()}/ImageDir/${file}.${type}`
            if (fs.existsSync(nonextensionedFile)) return res.sendFile(nonextensionedFile)
        }
    })

    app.get("*", (req, res) => {
        return nextHandler(req, res)
    })

    app.post('/api/*', (req, res) => {
        return nextHandler(req, res)
    })
})

//Websocket Connection Configuration
ioSocket.on('connection', (socket) => {

    socket.on('id-set', ({ socketID }) => {
        socket.join(`id-${socketID}`)
    });

    socket.on('voice-channel-join', ({ channelID, userID }) => {
        socket.join(`voice`)
        socket.join(`voice-${channelID}`)
        socket.broadcast.to(`voice-${channelID}`).emit(`seek-offer`, { seekerID: userID })
    });

    socket.on('candidate', ({ data }) => {
        socket.broadcast.to(`voice`).emit(`new-candidate`, { data })
    });

    socket.on('offer-send', ({ offer, seekerID, offererID }) => {
        ioSocket.to(`id-${seekerID}`).emit(`offer`, { offer, offererID })
    });

    socket.on('answer-send', ({ answer, offererID }) => {
        ioSocket.to(`id-${offererID}`).emit(`answer`, { answer })
    });


    //Message Event
    socket.on('message-create', async ({ text, userID, channelID }) => {

        let req = await fetch(`${global.hostname}/api/messages/create`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ text: text, userID: userID, channelID: channelID })
        })

        if (req.status === 201) return ioSocket.to(`@${channelID}`).emit('message-created', (await req.json()).MESSAGE_CREATE[0])

        return ioSocket.to(`@${channelID}`).emit('error', (await req.json()))
    });

    socket.on('text-channel-join', ({ room }) => {
        Array.from(socket.rooms).slice(1).filter(searchRoom => { return searchRoom.startsWith("@") }).forEach(exitRoom => {
            socket.leave(exitRoom)
        })
        socket.join(`@${room}`)
    });

    socket.on('voice-channel-disconnect', ({ id }) => {
        Array.from(socket.rooms).slice(1).filter(searchRoom => { return searchRoom.startsWith("!") }).forEach(exitRoom => {
            console.log(exitRoom)
            socket.broadcast.to(exitRoom).emit("voice-user-disconnected", { id: id })
            socket.leave(exitRoom)
        })
    })

    socket.on('JoinRoom', ({ room }) => {
        socket.join(room)
        socket.on("disconnecting", () => {
            let to = Array.from(socket.rooms).slice(1)
            socket.broadcast.to(to).emit("user-disconnected", { id: socket.id })
        })
    });

    socket.on('ExitAllRooms', async () => {
        Array.from(socket.rooms).slice(1).forEach((e) => {
            socket.leave(e)
        })
    });

    socket.on("user-disconnected", ({ id, to }) => {
        if (!socket.rooms.has(to)) return
        socket.broadcast.to(to).emit("user-disconnected", { id: id })
    })

});

//Start Server
httpServer.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
})