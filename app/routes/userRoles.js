const userRolesController = require('../controllers/userRolesController')
const { verifyToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/get-supers', verifyToken, userRolesController.getOnlySuperAdmins)
router.get('/get-admins', verifyToken, userRolesController.getOnlyAdmins)
router.get('/get-users', verifyToken, userRolesController.getOnlyUsers)

module.exports = { router}