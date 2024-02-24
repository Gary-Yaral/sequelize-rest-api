const userRoleController = require('../controllers/userRoleController')
const userController = require('../controllers/userController')
const { validatorUser } = require('../validators/userValidator')
const { validatorPasswordReset } = require('../validators/passwordValidatorReset')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/auth', userRoleController.getAuth)
router.post('/', validatorUser, userController.add)
router.put('/password', validatorPasswordReset, userController.resetPassword)
router.put('/:id/:roleId', validatorUser, userController.update)
router.delete('/:id', userController.remove)

module.exports = { router}