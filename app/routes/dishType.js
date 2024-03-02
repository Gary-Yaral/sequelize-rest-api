
const dishTypeController = require('../controllers/dishTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const { propTypeValidator } = require('../validators/commonValidator')
const DishType = require('../models/dishTypeModel')

router.get('/', validateToken, dishTypeController.paginate)
router.post('/filter', validateToken, dishTypeController.filterAndPaginate)
router.post('/', validateToken, propTypeValidator, dishTypeController.add)
router.put('/:id', validateToken, findId(DishType), propTypeValidator, dishTypeController.update)
router.delete('/:id', validateToken, findId(DishType), dishTypeController.remove)
router.get('/list', validateToken, dishTypeController.getAll)

module.exports = { router}