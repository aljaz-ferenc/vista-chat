const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    name: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readBy: [String],
        content: String
    }
})

module.exports = mongoose.model('Chat', chatSchema)