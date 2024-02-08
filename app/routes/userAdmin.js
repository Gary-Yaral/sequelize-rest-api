const userRoleController = require('../controllers/userRoleController')
const userAdminController = require('../controllers/userAdminController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.post('/auth', userRoleController.getAuth)
router.post('/add', userAdminController.add)
router.put('/update', userAdminController.update)
router.delete('/remove', userAdminController.remove)

module.exports = { router}