
const packageController = require('../controllers/packageController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const Package = require('../models/packageModel')
const { packageValidator } = require('../validators/packageValidator')

router.get('/', validateToken, packageController.paginate)
router.get('/find/:id', validateToken, findId(Package), packageController.findOne)
/* router.get('/list', validateToken, packageController.getAll) */
router.get('/statuses', validateToken, packageController.getStatuses)
router.post('/filter', validateToken, packageController.filterAndPaginate)
router.post('/', validateToken, packageValidator , packageController.add)
router.put('/:id', validateToken, findId(Package), packageController.update)
router.delete('/:id', validateToken, findId(Package), packageController.remove)

module.exports = { router}