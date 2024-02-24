const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { validateDNI } = require('../utils/ecuadorianDni')
const User = require('../models/userModel')
const { customMessages } = require('../utils/customMessages.js')
const { emailRegex, hardTextRegex } = require('../utils/regExp')

const validatorPasswordReset = [
  check('dni')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => validateDNI(value)).withMessage(customMessages['dni.valid'])
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { dni: req.body.dni }, raw:true })
      return user ? true: false
    }),
  check('email')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => emailRegex.test(value)).withMessage(customMessages['email.invalid']),
  check('password')
    .exists()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  (req, res, next) => {
    validateRequest(req, res, next)
  }
]


module.exports = {
  validatorPasswordReset
}

