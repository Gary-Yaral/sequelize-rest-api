
const categoryController = require('../controllers/category.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()

router.get('/', validateToken, categoryController.getAll)

module.exports = { router}