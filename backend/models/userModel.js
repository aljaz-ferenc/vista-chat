const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'User with this email already exists'],
        required: [true, 'email required']
    },
    name: {
        type: String,
        unique: [true, 'User with this username already exists'],
        required: [true, 'name required']
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    avatar: String,
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    }],
    theme: {
        type: String,
        default: 'dark'
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    avatar: Object,
    phone: String,
    birthDate: Date,
    education: String,
    work: String
}, {
    methods: {
        async checkPassword(candidate, password) {
            return await bcrypt.compare(candidate, password)
        }
    }
})

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 4)
})


module.exports = mongoose.model('User', userSchema)