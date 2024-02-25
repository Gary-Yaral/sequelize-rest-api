const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest')
const { validateDNI } = require('../utils/ecuadorianDni')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex, hardTextRegex, telephoneRegex, emailRegex } = require('../utils/regExp')
const { findRepeatedUser } = require('../utils/functions.js')

const validatorUser = [
  check('dni')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => validateDNI(value)).withMessage(customMessages['dni.valid'])
    .customSanitizer(async( value, { req }) => {
      await findRepeatedUser(req, {dni: req.body.dni})
      return value
    })
    .custom((value, {req}) => !req.repeatedUser).withMessage(customMessages['dni.repeated']),
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('lastname')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .toUpperCase(),
  check('telephone')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .isLength({min: 10, max: 10}).withMessage(customMessages['telephone.length'])
    .custom((value) => telephoneRegex.test(value)).withMessage(customMessages['telephone.invalid']),
  check('email')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => emailRegex.test(value)).withMessage(customMessages['email.invalid']),
  check('username')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid'])
    .customSanitizer(async( value, { req }) => {
      await findRepeatedUser(req, { username: req.body.username })
      return value
    })
    .custom((value, {req}) => !req.repeatedUser).withMessage(customMessages['username.repeated']),
  check('password')
    .optional()
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !value.includes(' ')).withMessage(customMessages['include.blanks'])
    .custom((value) => hardTextRegex.test(value)).withMessage(customMessages['hardText.invalid']),
  check('status')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isInt().withMessage(customMessages['number.int']),
  async (req, res, next) => {
    let { dni, name, lastname, email, telephone, username, role, status } = req.body
    req.body.userData = { dni, name, lastname, telephone, username, email }
    req.body.userRoleData = {roleId: role, statusId: status}
    if(req.body.password) [
      req.body.userData.password = req.body.password
    ]
    // Si existe el usuario buscamos los datos actuales del rol de usuario
    validateRequest(req, res, next)
  }
]


module.exports = {
  validatorUser
}

