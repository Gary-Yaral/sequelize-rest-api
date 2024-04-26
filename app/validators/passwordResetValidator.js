const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { hardTextRegex } = require('../utils/regExp.js')

const validatorPasswordReset = [
  check('password')
    .exists()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  (req, res, next) => {
    console.log(req.body)
    validateRequest(req, res, next)
  }
]


module.exports = {
  validatorPasswordReset
}

