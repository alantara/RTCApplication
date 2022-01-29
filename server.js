const app = require("express")();
const server = require("http").Server(app);
const Socket = require("socket.io")(server);
const { Server } = require("socket.io");
const io = new Server(server);

const next = require("next")
const nextApp = next({ dev: true })
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return nextHandler(req, res)
    })
})

io.on('connection', (socket) => {
    Socket.emit("message", { message: "Server Opened" })
    console.log('a user connected');

    socket.on('message', (arg) => {
        console.log(arg);
        io.emit('message', "Button Pressed 2")
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
})