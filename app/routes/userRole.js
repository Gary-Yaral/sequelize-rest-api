const userRolesController = require('../controllers/userRoleController')
const {validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/', validateToken, userRolesController.paginate)
router.post('/filter', validateToken, userRolesController.filterAndPaginate)
router.get('/get-supers', validateToken, userRolesController.getOnlySuperAdmins)
router.get('/get-admins', validateToken, userRolesController.getOnlyAdmins)
router.get('/get-users', validateToken, userRolesController.getOnlyUsers)
router.get('/all', validateToken, userRolesController.getOnlyUsers)
router.get('/find-one/:id', validateToken, userRolesController.findOne)

module.exports = { router }