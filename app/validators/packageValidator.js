const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const Package = require('../models/package.model.js')

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
    // Validamos si está guardando o actualizando
    const validation = await isRepeated(req)
    if(!validation.isValid) {
      return res.json({error: true, msg: validation.msg})
    }

    // Validamos los errores
    validateRequest(req, res, next)
  }
]

async function isRepeated(req) {
  try {
    // Verificamos si ya existe un paquete con ese nombre
    let found = await Package.findOne({
      where: {
        name: req.body.name.toUpperCase(),
        userRoleId: req.user.data.UserRole.id
      }
    })
    // Si no existe aun la respuesta será ok
    if(!found) {
      return {
        isValid: true,
        msg: ''
      }
    }
    // Verificamos si esta actualizando o no
    if(req.method === 'PUT' && req.params.id) {
      if(parseInt(req.params.id) === req.packData.userRoleId) {
        return {
          isValid: true,
          msg: ''
        }
      } 
    }

    return {
      isValid: false,
      msg: 'Este usuario ya tiene registrado un paquete con el nombre: '+req.packData.name 
    }
  } catch (error) {
    console.log(error)
    return {
      isValid: false,
      msg: 'Error al validar el paquete con el nombre: '+req.body.name 
    }
  }

}
module.exports = { packageValidator }