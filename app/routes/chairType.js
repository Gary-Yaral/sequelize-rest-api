
const chairTypeController = require('../controllers/chairTypeController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/all', chairTypeController.getAll)
router.post('/add', chairTypeController.add)
router.put('/update', chairTypeController.update)
router.delete('/remove', chairTypeController.remove)

module.exports = { router}