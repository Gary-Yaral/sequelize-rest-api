const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')

const authValidator = [
  check('username')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty']),
  check('password')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty']),
  async (req, res, next) => {
    validateRequest(req, res, next)
  }
]

module.exports = { authValidator }