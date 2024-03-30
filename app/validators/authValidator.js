const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { hardTextRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')

const authValidator = [
  check('username')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  check('password')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  async (req, res, next) => {
    validateRequest(req, res, next)
  }
]

module.exports = { authValidator }