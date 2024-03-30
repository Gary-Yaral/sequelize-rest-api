const tokenController = require('../controllers/tokenController')
const { validateRefreshToken } = require('../middlewares/auth')
const router = require('express').Router()

router.post('/refresh', validateRefreshToken, tokenController.refresh)

module.exports = { router}