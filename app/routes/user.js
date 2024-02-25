const userRoleController = require('../controllers/userRoleController')
const userController = require('../controllers/userController')
const { validatorUser } = require('../validators/userValidator')
const { validatorPasswordReset } = require('../validators/passwordValidatorReset')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/auth', userRoleController.getAuth)
router.put('/password', validatorPasswordReset, userController.resetPassword)
router.post('/', validateToken, validatorUser, userController.add)
router.put('/:id/:roleId', validateToken, validatorUser, userController.update)
router.delete('/:id', validateToken, userController.remove)

module.exports = { router}