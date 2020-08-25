const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

io.on('connection', socket => {
    socket.on('notification', (message) => {
        const {
            to,
        } = message;

        if (to === 'all') {
            socket.broadcast.emit(`notification`, message);
        } else {
            console.log('aaaa', message);
            socket.broadcast.to(to).emit("notification", message);
        }
    });

    socket.on('join', (userId) => {
        console.log(userId);
        socket.join(userId);
    });
});

app.post('/', (req, res) => {
    const {
        body
    } = req;

    const {
        to
    } = body;

    if (to === 'all') {
        io.sockets.emit(`notification`, body);
    } else {
        io.sockets.to(to).emit("notification", body);
    }

    res.status(204).send();
});

app.get('/', (req, res) => {
    res.status(200).send({
        status: '200',
        message: 'App working'
    })
});

server.listen(port, () => console.log(`listening on port ${port}`));