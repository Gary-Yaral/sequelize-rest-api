const userRoleController = require('../controllers/userRoleController')
const userController = require('../controllers/userController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/auth', userRoleController.getAuth)
router.post('/add', userController.add)
router.put('/update', userController.update)
router.delete('/remove', userController.remove)

module.exports = { router}