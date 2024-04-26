const userController = require('../controllers/userController')
const { verifyUserExistsToResetPassword } = require('../middlewares/verifyUserExistsToResetPassword')
const { validotorUserDataToResetPassword } = require('../validators/userDataToResetPasswordValidator')
const router = require('express').Router()

router.put('/:id', userController.resetPassword)
router.post('/', validotorUserDataToResetPassword, verifyUserExistsToResetPassword, userController.sendEmailToReset)

module.exports = { router }