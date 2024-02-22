const userRoleController = require('../controllers/userRoleController')
const userController = require('../controllers/userController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/auth', userRoleController.getAuth)
router.post('/', userController.add)
router.put('/:id/:roleId', userController.update)
router.delete('/:id', userController.remove)

module.exports = { router}