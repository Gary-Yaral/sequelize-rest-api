
const homeController = require('../controllers/homeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/', validateToken, homeController.getHomeData)

module.exports = { router}