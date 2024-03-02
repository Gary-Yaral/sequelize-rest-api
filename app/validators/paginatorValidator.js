const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { customMessages } = require('../utils/customMessages')

const validatorFilter = [
  check('currentPage')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isNumeric().withMessage(customMessages['price']),
  check('perPage')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isNumeric().withMessage(customMessages['price']),
  check('filter')
    .exists().withMessage(customMessages['required']),
  async(req, res, next) => {
    validateRequest(req, res, next)
  }
]

module.exports = { validatorFilter }