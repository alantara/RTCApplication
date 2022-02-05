//Server Variables
const app = require("express")();
const httpServer = require("http").Server(app);

const { Server } = require("socket.io");
const ioSocket = new Server(httpServer);

require('dotenv').config()
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


db.connect(function (err) {
    if (err) throw err;

    //Routing (Next.js)
    nextApp.prepare().then(() => {
        //+Add Api Routes
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
        socket.on('MessageSend', (message) => {

            let sql = `INSERT INTO messages (messages, timestamp, author) VALUES ("${message.message}",${message.timestamp},"${message.user}")`

            db.query(sql, function (err, result) {
                if (err) throw err;
            });

            ioSocket.emit('MessageReceived', message)
        });

        //Clear Message
        socket.on('ClearChat', (timestamp) => {

            let sql = `DELETE FROM messages WHERE timestamp=${timestamp}`

            db.query(sql, function (err, result) {
                if (err) throw err;
            });

            ioSocket.emit('ClearChatReceived', timestamp)
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