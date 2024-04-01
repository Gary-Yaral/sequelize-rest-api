
const categoryController = require('../controllers/category.controller')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const Category = require('../models/category.model')
const { categoryValidator } = require('../validators/category.validator')
const router = require('express').Router()
Category

router.get('/', validateToken, categoryController.paginate)
router.get('/find/:id', validateToken, findId(Category), (req, res) => {res.json({done: true})})
router.get('/list', validateToken, categoryController.getAll)
router.post('/', validateToken, categoryValidator, categoryController.add)
router.post('/filter', validateToken, categoryController.filterAndPaginate)
router.put('/:id', validateToken, findId(Category), categoryValidator, categoryController.update)
router.delete('/:id', validateToken, findId(Category), categoryController.remove)

module.exports = { router}