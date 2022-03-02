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
        socket.on('MessageSend', async ({ message, userID, channelID }) => {

            let req = await fetch(`${hostname}/api/message/create`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: message, userID: userID, channelID: channelID })
            })
            if (req.status == 200) { ioSocket.to(channelID).emit('MessageReceived', (await req.json())) }

        });

        //Clear Message
        socket.on('ClearChat', (timestamp) => {

            let sql = `DELETE FROM messages WHERE timestamp=${timestamp}`

            db.query(sql, function (err, result) {
                if (err) throw err;
            });

            ioSocket.emit('ClearChatReceived', timestamp)
        });

        socket.on('JoinRoom', ({ room }) => {
            socket.join(room)
        });

        socket.on('ExitAllRooms', async () => {
            let a = []

            for (let e of socket.rooms) {
                if (e.match(/^[0-9]+$/)) {
                    a.push(e)
                }
            }

            for (let e of a) {
                socket.leave(e)
            }
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected');
        });
    });

    //Start Server
    httpServer.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
});