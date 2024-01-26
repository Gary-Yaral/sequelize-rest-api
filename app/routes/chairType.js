
const chairTypeController = require('../controllers/chairTypeController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/', chairTypeController.getAll)
router.post('/', chairTypeController.add)
router.put('/:id', chairTypeController.update)
router.delete('/:id', chairTypeController.remove)

module.exports = { router}