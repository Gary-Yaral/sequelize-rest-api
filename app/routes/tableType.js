
const tableTypeController = require('../controllers/tableTypeController')
/* const { validateToken } = require('../middlewares/auth') */
const router = require('express').Router()

router.get('/', tableTypeController.getAll)
router.post('/', tableTypeController.add)
router.put('/:id', tableTypeController.update)
router.delete('/:id', tableTypeController.remove)

module.exports = { router}