const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { getErrorFormat } = require('../utils/errorsFormat.js')
const Package = require('../models/packageModel.js')

const packageValidator = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('status')
    .isInt().withMessage(customMessages['number.int'])
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  async (req, res, next) => {
    try {
      let found = await Package.findOne({
        where: {
          name: req.body.name,
          userRoleId: req.user.data.UserRole.id
        }
      })
      console.log(found)
      if(found) {
        return res.json({error: true, msg: 'Este usuario ya tiene registrado ese nombre de paquete'})
      }
      validateRequest(req, res, next)
    } catch (error) {
      console.log(error)
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al verificar codigo repetido', errorName) }
      let errorKeys = [errorName]
      return res.status(400).json({ errors, errorKeys })
    }
  }
]
module.exports = { packageValidator }