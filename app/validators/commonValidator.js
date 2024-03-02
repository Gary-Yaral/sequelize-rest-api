const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')

const typeValidator = [
  check('type')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('price')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isNumeric().withMessage(customMessages['price']),
  check('description')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('image')
    .optional(), 
  async (req, res, next) => {
    validateRequest(req, res, next)
  }
]

const propTypeValidator = [
  check('type')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  async (req, res, next) => {
    validateRequest(req, res, next)
  }
]


module.exports = {
  typeValidator,
  propTypeValidator
}

