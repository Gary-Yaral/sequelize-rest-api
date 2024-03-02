
const drinkTypeController = require('../controllers/drinkTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const { propTypeValidator } = require('../validators/commonValidator')
const DrinkType = require('../models/drinkTypeModel')

router.get('/', validateToken, drinkTypeController.paginate)
router.post('/filter', validateToken, drinkTypeController.filterAndPaginate)
router.post('/', validateToken, propTypeValidator, drinkTypeController.add)
router.put('/:id', validateToken, findId(DrinkType), propTypeValidator, drinkTypeController.update)
router.delete('/:id', validateToken, findId(DrinkType), drinkTypeController.remove)
router.get('/list', validateToken, drinkTypeController.getAll)

module.exports = { router}