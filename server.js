//Server Variables
const app = require("express")();
const httpServer = require("http").Server(app);

const { Server } = require("socket.io");
const ioSocket = new Server(httpServer);

//Next Variables
const next = require("next")
const nextApp = next({ dev: true })
const nextHandler = nextApp.getRequestHandler();

//Routing (Next.js)
nextApp.prepare().then(() => {
    //+Add Api Routes
    app.get("*", (req, res) => {
        return nextHandler(req, res)
    })
})

//Websocket Connection Configuration
ioSocket.on('connection', (socket) => {
    console.log('user connected');

    socket.on('MessageSend', (message) => {
        ioSocket.emit('MessageReceived', message)
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

//Start Server
httpServer.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
})