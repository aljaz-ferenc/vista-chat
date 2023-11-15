const express = require('express')
const chatController = require('../controllers/chatController')

const router = express.Router()

router.route('/')
    .post(chatController.createChat)

router.route('/:chatId')
    .patch(chatController.getChatById)
    .post(chatController.addNewMessage)

router.route('/:chatId/messages/:messageId')
    .delete(chatController.deleteMessage)

router.route('/request')
    .post(chatController.sendChatRequest)

router.route('/:chatId/batches/:batchNumber')
    .get(chatController.getPreviousBatch)

router.route('/user/:userId')
    .get(chatController.getChatsByUser)

module.exports = router