const mongoose = require('mongoose')

const batchSchema =new mongoose.Schema({
    messages: [{
        content: String,
        user: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
        images: [{
            id: String,
            name: String,
            url: String
        }],
        files: [{
            name: String,
            url: String
        }]
    }],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    batchNumber: {
        type: Number
    },
})

module.exports = mongoose.model('Batch', batchSchema)