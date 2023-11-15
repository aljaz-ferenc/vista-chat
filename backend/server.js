const express = require('express')
const userRouter = require('./routes/userRoutes')
const chatRouter = require('./routes/chatRoutes')
const authRouter = require('./routes/authRoutes')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const socketio = require('socket.io')
const EventEmitter = require('./EventEmitter')

let connectedUsers = []

const DB = process.env.DATABASE

mongoose.connect(DB).then(() => console.log('Databse connected successfully'))
    .catch((err) => console.log(`Error connecting to database: ${err}`))

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

app.use(`/api/v1/users`, userRouter)
app.use(`/api/v1/chats`, chatRouter)
app.use(`/api/v1/auth`, authRouter)

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        timeout: 10000
    },
})

io.on('connect', (socket) => {
    io.emit('connectedUsers', connectedUsers.map(u =>u.id))
    
    socket.on('disconnect', () => {
        const user = connectedUsers.find(user => user.socketId === socket.id)
        console.log(connectedUsers)
        connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id)
        if(user){
            io.emit('connectedUsers', connectedUsers.map(u =>u.id))
        }
    })
    
    socket.on('loginUser', (user) => {
        if(!connectedUsers.some(u => u.id === user.id)){
            connectedUsers.push(user)
            io.emit('connectedUsers', connectedUsers.map(u =>u.id))
        }
    })
    socket.on('getConnectedUsers', (ack) => {
        console.log('getConnectedUsers')
        ack(connectedUsers.map(u =>u.id))
    })

    socket.on('isTyping', (bool, senderId, receiverId, chatId) => {
        console.log(bool, senderId, receiverId, chatId)
        const receiver = connectedUsers.find(u => u.id === receiverId)

        if(!receiver) return

        io.to(receiver.socketId).emit('isTyping', bool)
    })
})


EventEmitter.on('newChat', (newChat, users) => {
    users.forEach(u => {
        const user = connectedUsers.find(us => us.id === u)
        if(user){
            io.to(user.socketId).emit('newChat', newChat)
        }
    })
})

EventEmitter.on('newMessage', (chatId, users) => {
    console.log('socket newMessage')
    const usersArr = users
        .map((user) => connectedUsers.find((u) => u.id === user.toString()))
        .filter((user) => user !== undefined);

    usersArr.forEach(user => {
        io.to(user.socketId).emit('newMessage', chatId)
    })
})