
const packageController = require('../controllers/packageController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const { propTypeValidator } = require('../validators/commonValidator')
const DrinkType = require('../models/packageModel')

router.get('/', validateToken, packageController.paginate)
router.post('/filter', validateToken, packageController.filterAndPaginate)
router.post('/', validateToken, packageController.add)
router.put('/:id', validateToken, findId(DrinkType), propTypeValidator, packageController.update)
router.delete('/:id', validateToken, findId(DrinkType), packageController.remove)
router.get('/list', packageController.getAll)

module.exports = { router}