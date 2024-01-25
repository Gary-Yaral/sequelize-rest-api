const userRolesController = require('../controllers/userRolesController')
const {validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/get-supers', validateToken, userRolesController.getOnlySuperAdmins)
router.get('/get-admins', validateToken, userRolesController.getOnlyAdmins)
router.get('/get-users', validateToken, userRolesController.getOnlyUsers)

module.exports = { router}