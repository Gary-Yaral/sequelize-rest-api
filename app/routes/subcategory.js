
const subcategoryController = require('../controllers/subcategory.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const Subcategory = require('../models/subcategory.model')
const { subcategoryValidator } = require('../validators/subcategory.validator')

router.get('/', validateToken, subcategoryController.paginate)
router.get('/list/:id', validateToken, subcategoryController.findByCategory)
router.get('/find/:id', validateToken, findId(Subcategory), subcategoryController.find)
router.get('/list', validateToken, subcategoryController.getAll)
router.post('/', validateToken, subcategoryValidator, subcategoryController.add)
router.post('/filter', validateToken, subcategoryController.filterAndPaginate)
router.put('/:id', validateToken, findId(Subcategory), subcategoryValidator, subcategoryController.update)
router.delete('/:id', validateToken, findId(Subcategory), subcategoryController.remove)

module.exports = { router}