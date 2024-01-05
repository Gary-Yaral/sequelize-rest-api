const userController = require('../controllers/user')
const { verifyToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/get-all', verifyToken, userController.getAll)

module.exports = { router}