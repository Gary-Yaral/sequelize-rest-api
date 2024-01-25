const userRolesController = require('../controllers/userRolesController')
const userController = require('../controllers/userController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/auth', userRolesController.getAuth)
router.post('/add', userController.add)
router.put('/update', userController.update)
router.delete('/remove', userController.remove)

module.exports = { router}