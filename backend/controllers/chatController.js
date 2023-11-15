const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Batch = require('../models/batchModel')
const EventEmitter = require('../EventEmitter')

exports.getChatsByUser = async (req, res) => {
    const { userId } = req.params
    const chats = await Chat.find({ users: userId })
}

exports.createChat = async (req, res) => {
    const { users } = req.body

    try {

        const chat = await Chat.create({ users: [...users] })
        const newBatch = new Batch({ chat: chat._id })
        await newBatch.save()

        await chat.populate([{
            path: 'users',
            select: 'name email _id avatar'
        }, {
            path: 'lastMessage'
        }])

        EventEmitter.emit('newChat', chat, users)

        res.status(201).json({
            status: 'success',
            data: chat
        })


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getChatById = async (req, res) => {
    const { chatId } = req.params
    const { userId, addUserToReadBy } = req.body

    try {
        const chat = await Chat.findById(chatId).populate('users')

        if (!chat) throw new Error('Chat not found')

        if (addUserToReadBy && !chat.lastMessage.readBy.includes(userId)) {
            await chat.updateOne({ $addToSet: { 'lastMessage.readBy': userId } })
        }

        const updatedChat = await Chat.findById(chatId).populate('users')

        const batches = await Batch.find({ chat: chatId })

        let messages = []

        if (batches.length === 1) {
            messages = batches[0].messages
        }
        if (batches.length > 1) {
            messages = [...batches.at(-2).messages, ...batches.at(-1).messages]
        }

        res.status(200).json({
            status: 'success',
            data: { chat: updatedChat, messages, lastBatch: batches.length }
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getPreviousBatch = async (req, res) => {
    const { batchNumber, chatId } = req.params
    const batches = await Batch.find({ chat: chatId }).select('_id')
    const batch = await Batch.findById(batches.at(batchNumber - 1)._id)

    res.status(200).json({
        status: 'success',
        data: batch
    })
}

exports.addNewMessage = async (req, res) => {
    const { message, userId, images, files } = req.body
    const { chatId } = req.params

    const newMessage = {
        content: message,
        user: userId,
        timestamp: Date.now(),
        images,
        files
    }

    const batches = await Batch.find({ chat: chatId })
    console.log('batches: ', batches)
    const chat = await Chat.findById(chatId)
    await chat.updateOne({ lastMessage: { user: userId, content: message, readBy: [userId] } })

    //if no batches exist, create a new one with the new message
    if (batches.length === 0) {
        const newBatch = await Batch.create({ messages: [newMessage], chat: chat._id })
    }else{
        //if batch is not yet full, add the message to it
        if (batches.at(-1).messages.length < 20) {
            //add a message to last batch
            await batches.at(-1).updateOne({ $addToSet: { messages: newMessage } })
        }
        //if batch is full, create a new one with the new message
        if (batches.at(-1).messages.length >= 20) {
            const newBatch = await Batch.create({ messages: [newMessage], chat: chat._id })
        }
    }

    EventEmitter.emit('newMessage', chat._id, chat.users)

    res.status(201).json({
        status: 'success',
        data: newMessage
    })
}


exports.deleteMessage = async (req, res) => {
    const { messageId, chatId } = req.params
    const chat = await Chat.findById(chatId)
    const batch = await Batch.findOneAndUpdate({ chat: chat._id, 'messages._id': messageId }, { $pull: { messages: { _id: messageId } } }, { new: true })
    console.log('deleting message')

    if (batch?.messages.length === 0) {
        await batch.deleteOne()
    }

    const batches = await Batch.find({ chat: chatId })

    const lastMessage = batches.map(b => b.messages).flat().at(-1)

    if (lastMessage?.user) {
        const { user, content } = lastMessage
        console.log(user, content)
        await chat.updateOne({ lastMessage: { user: user, content: content, readBy: chat.users } })
    } else {
        await chat.updateOne({ lastMessage: { user: null, content: null, readBy: [] } })
    }

    EventEmitter.emit('newMessage', chatId, chat.users)
}