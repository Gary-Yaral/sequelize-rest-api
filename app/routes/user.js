const userRolesController = require('../controllers/userRolesController')
/* const { verifyToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/auth', userRolesController.getAuth)

module.exports = { router}