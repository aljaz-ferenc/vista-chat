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

app.use(express.static('./node_modules/@socket.io/admin-ui/ui/dist'))

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

app.use(`/api/v1/users`, userRouter)
app.use(`/api/v1/chats`, chatRouter)
app.use(`/api/v1/auth`, authRouter)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const io = socketio(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        timeout: 10000
    },
})

io.on('connect', (socket) => {
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.socketId !== socket.id)
    })

    socket.on('loginUser', (user) => {
        if(!connectedUsers.some(user => user.socketId === socket.id))
        connectedUsers.push(user)
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

    const usersArr = users
        .map((user) => connectedUsers.find((u) => u.id === user.toString()))
        .filter((user) => user !== undefined);

    usersArr.forEach(user => {
        io.to(user.socketId).emit('newMessage', chatId)
    })
})