const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const blacklistedTokens = require('../blacklist')

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user) throw new Error('User doesn\'t exist')

        const passIsValid = await user.checkPassword(password, user.password)

        if (!passIsValid) throw new Error('Invalid password')

        user.password = undefined

        const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' })

        res.cookie('chatAppJWT', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        })

        res.status(200).json({
            status: 'success',
            // data: user
        })

    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.authenticateUser = async (req, res) => {
    const token = req.cookies.chatAppJWT

    try {
        if (blacklistedTokens.includes(token)) throw new Error('Token blacklisted')
        const encoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(encoded.user._id).select('name _id email theme gender birthDate phone education work avatar').populate({
            path: 'chats',
            select: 'users _id'
        })
        const chats = await Chat.find({ users: user._id }).populate({
            path: 'users',
            select: 'name email _id avatar'
        })

        res.status(200).json({
            status: 'success',
            data: { user, chats }
        })
    } catch (err) {

        res.status(401).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.logoutUser = async (req, res) => {
    const token = req.cookies.chatAppJWT
    blacklistedTokens.push(token)
    res.status(204).end()
}

exports.changePassword = async (req, res) => {
    const { userId, newPassword, currentPassword } = req.body

    try {
        const user = await User.findById(userId).select('+password')
        if (!user) throw new Error('User not found')

        const passIsVerified = await user.checkPassword(currentPassword, user.password)
        if (!passIsVerified) throw new Error('Password incorrect')

        user.password = newPassword
        await user.save()

        user.password = undefined

        res.status(200).json({
            status: 'success',
            data: user
        })


    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}