const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()
router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser)

router.route('/:userId')
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:query')
    .get(userController.queryUsers)

router.route('/get-one/:userId')
    .get(userController.getUserById)

module.exports = router