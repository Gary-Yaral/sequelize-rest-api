const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { emailRegex } = require('../utils/regExp.js')

const validotorUserDataToResetPassword = [
  check('username')
    .exists()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks']),
  check('email')
    .exists()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => emailRegex.test(value)).withMessage(customMessages['email.invalid']),
  (req, res, next) => {
    validateRequest(req, res, next)
  }
]


module.exports = { validotorUserDataToResetPassword }

