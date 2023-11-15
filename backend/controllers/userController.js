const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.getUsers = async (req, res) => {
    res.status(200).json({
        users: 'all users'
    })
}

exports.createUser = async (req, res) => {
    const { name, password, passwordConfirm, email } = req.body

    try {
        if (password !== passwordConfirm) throw new Error('Passwords do not match')

        const user = await User.create({ name, password, email })

        const token = jwt.sign({user}, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })

        res.cookie('chatAppJWT', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })

        user.password = undefined

        res.status(201).json({
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

exports.queryUsers = async (req, res) => {
    const query = req.params.query
    const regex = new RegExp(query, 'i')
    
    const users = await User.find({name: {$regex: regex}}).select('name _id avatar')

    res.status(200).json({
        data: users
    })
}

exports.getUserById = async (req, res) => {
    const {userId} = req.params

    const user = await User.findById(userId).select('name _id')

    res.status(200).json({
        status: 'success',
        data: user
    })
}

exports.updateUser = async (req,res) => {
    const {userId} = req.params
    const updates = req.body

    try{
        const user = await User.findByIdAndUpdate(userId, updates, {new: true})
        if(!user) throw new Error('User not found')

        res.status(200).json({
            status: 'success',
            data: user
        })
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    const {userId} = req.params
    const {password} = req.body
    
    console.log(userId)
    try{
        const user = await User.findById(userId).select('+password')
        if(!user) throw new Error('User not found')

        const passIsVerified = await user.checkPassword(password, user.password)
        if (!passIsVerified) throw new Error('Password incorrect')

        await user.deleteOne()

        res.status(200).json({
            status: 'success',
            data: 'user deleted'
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}