const express = require('express');
const app = express();
const http = require('http')
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 3000;

const { newUser, getActiveUser, getIndividualRoomUsers } = require('./helper/helperfun')

io.sockets.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);
        socket.join(user.room)

        socket.emit('message', () => {
            console.log(`${socket.id} joined ${room} room`)
        })

        socket.broadcast.to(user.room).emit('message', "User joind room")

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        })
    })

    socket.on('sendProgress', (progress, filename) => {
        socket.broadcast.emit('sendProgress', progress, filename);
    })

    socket.on('sendMessage', (msg, peer) => {
        // const user = getActiveUser(socket.id)
        socket.broadcast.emit('sendToClient', msg, peer);
        // io.to(user.room).emit('sendToClient', msg)
    })
})


app.get('/room', (req, res) => {
    // res.sendFile(__dirname + '/public/views/room.html');
    let roomID = Math.floor(1000 + Math.random() * 9000);
    console.log(roomID);
    res.redirect('/room/' + roomID)
})

app.get('/room/:roomID', (req, res) => {
    let roomid = req.params.roomID;
    console.log("New peer in " + roomid);
    res.sendFile(__dirname + '/public/views/room2.html')
})

app.get('/room2', (req, res) => {
    res.sendFile(__dirname + '/public/views/room.html');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
})

server.listen(PORT, () => {
    console.log(`Express app listening on PORT ${PORT}`);
})