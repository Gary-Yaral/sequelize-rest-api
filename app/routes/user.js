const userRoleController = require('../controllers/userRoleController')
const userController = require('../controllers/userController')
const { validatorUser } = require('../validators/userValidator')
const { validateToken } = require('../middlewares/auth')
const { validateUserDNI } = require('../middlewares/validateUserDNI')
const router = require('express').Router()

router.get('/auth', userRoleController.getAuth)
router.get('/reset-password/:dni', validateUserDNI, userController.resetPasswordView)
router.post('/', validateToken, validatorUser, userController.add)
router.put('/:id/:roleId', validateToken, validatorUser, userController.update)
router.delete('/:id', validateToken, userController.remove)

module.exports = { router}