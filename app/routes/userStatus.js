
const userStatusController = require('../controllers/userStatusController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()


router.get('/', validateToken, userStatusController.getAll)

module.exports = { router}