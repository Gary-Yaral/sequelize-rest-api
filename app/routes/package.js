
const packageController = require('../controllers/package.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const Package = require('../models/package.model')
const { packageValidator } = require('../validators/packageValidator')

router.get('/', validateToken, packageController.paginate)
router.get('/load/:id', validateToken, findId(Package), packageController.getSavedData)
/* router.get('/list', validateToken, packageController.getAll) */
router.get('/statuses', validateToken, packageController.getStatuses)
/* router.get('/section/:id', validateToken, packageController.getSectionData) */
router.get('/find/:id', validateToken, packageController.findOne)
router.post('/filter', validateToken, packageController.filterAndPaginate)
router.post('/', validateToken, packageValidator , packageController.add)
router.put('/:id', validateToken, findId(Package), packageController.update)
router.delete('/:id', validateToken, findId(Package), packageController.remove)

module.exports = { router}