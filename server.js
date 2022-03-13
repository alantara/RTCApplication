//Server Variables
const app = require("express")();
const httpServer = require("http").Server(app);

const { Server } = require("socket.io");
const ioSocket = new Server(httpServer);

require('dotenv').config()
let hostname = process.env.HOST_HOSTNAME ? process.env.HOST_HOSTNAME : 'http://localhost'
let port = 80

//Next Variables
const next = require("next")
const nextApp = next({ dev: process.env.NODE_ENV === "development" })
const nextHandler = nextApp.getRequestHandler();

//MySql Connection
const mysql = require('mysql');

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME
});

//Snowflake
const { Snowflake } = require('nodejs-snowflake');
const uid = new Snowflake();

//Multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/images')
    },
    filename: function (req, file, cb) {
        let fileID = `${(uid.idFromTimestamp(Date.now())).toString()}.${file.mimetype.split("/").pop()}`
        cb(null, fileID)
    }
})

const upload = multer({ storage: storage })

db.connect(function (err) {
    if (err) throw err;

    //Routing (Next.js)
    nextApp.prepare().then(() => {
        //+Add Api Routes

        app.post('/imageUpload', upload.fields([{ name: 'guildIcon', maxCount: 1 }, { name: 'guildBackground', maxCount: 1 }]), (req, res) => {
            res.status(201).json({ guildIconFilename: req.files.guildIcon[0].filename, guildBackgroundFilename: req.files.guildBackground[0].filename, guildName: req.body.guildName })
        })

        app.get('/images/:file(*)', (req, res) => {
            let file = req.params.file;
            let fileLocation = `${__dirname}/images/${file}`;
            res.sendFile(`${fileLocation}`)
        })

        app.get("*", (req, res) => {
            return nextHandler(req, res)
        })

        app.post('*', (req, res) => {
            return nextHandler(req, res)
        })
    })

    //Websocket Connection Configuration
    ioSocket.on('connection', (socket) => {

        //Message Event
        socket.on('message-create', async ({ message, userID, channelID }) => {

            let req = await fetch(`${hostname}/api/message/create`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: message, userID: userID, channelID: channelID })
            })
            if (req.status == 200) { ioSocket.to(`@${channelID}`).emit('message-created', (await req.json())) }

        });

        socket.on('text-channel-join', ({ room }) => {
            Array.from(socket.rooms).slice(1).filter(searchRoom => { return searchRoom.startsWith("@") }).forEach(exitRoom => {
                socket.leave(exitRoom)
            })
            socket.join(`@${room}`)
        });

        socket.on('voice-channel-join', ({ room, id }) => {
            let parsedRoom = `!${room}`
            let exitRoom = Array.from(socket.rooms).slice(1).filter(searchRoom => { return searchRoom.startsWith("!") })[0]

            console.log(exitRoom, parsedRoom)
            if (exitRoom == parsedRoom) return

            socket.leave(exitRoom)

            socket.join(parsedRoom)
            socket.broadcast.to(parsedRoom).emit("voice-user-joined", { id: id })
            socket.on("disconnecting", () => {
                Array.from(socket.rooms).slice(1).filter(searchRoom => { return searchRoom.startsWith("!") }).forEach(exitRoom => {
                    socket.broadcast.to(exitRoom).emit("voice-user-disconnected", { id: socket.id })
                })
            })
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
});