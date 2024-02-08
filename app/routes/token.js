const tokenController = require('../controllers/tokenController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/refresh', validateToken, tokenController.refresh)

module.exports = { router}