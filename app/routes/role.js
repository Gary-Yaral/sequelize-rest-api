
const roleController = require('../controllers/roleController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()


router.get('/', validateToken, roleController.getAll)

module.exports = { router}