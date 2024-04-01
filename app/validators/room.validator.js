const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex, emailRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const Item = require('../models/item.model.js')
const { deteleImage } = require('../utils/deleteFile.js')

const roomValidator = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks'])
    .customSanitizer((value) => value.toUpperCase()),
  check('description')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('telephone')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty']),
  check('email')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => emailRegex.test(value)).withMessage(customMessages['email.invalid']),
  check('address')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('capacity')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('perHour')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('perDay')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('perMonth')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('m2')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('minTimeRent')
    .exists().withMessage(customMessages['required'])
    .isNumeric().withMessage(customMessages['price'])
    .notEmpty().withMessage(customMessages['empty']),
  check('image')
    .optional()
    .notEmpty().withMessage(customMessages['empty']),
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
    // Verificamos si ya existe un item con ese nombre y esa categoria
    let found = await Item.findAll({
      where: {
        name: req.body.name
      }
    })
    // Si no existe aun la respuesta será ok
    if(found.length === 0) {
      return {
        isValid: true,
        msg: ''
      }
    }
    // Verificamos si esta actualizando o no
    if(req.method === 'PUT' && req.params.id) {
      if(parseInt(req.params.id) === found[0].id) {
        return {
          isValid: true,
          msg: ''
        }
      } else {
        // eliminamos la imagen guardada
        const hasError = deteleImage(req.body.image) 
        if(hasError) {
          console.log(hasError.message)
          return {
            isValid: false,
            msg: 'Error al remover la imagen guardada'
          } 
        }
        return {
          isValid: false,
          msg: `Ya existe el item ${req.body.name} en esa categoría`
        }
      }
    } else {
      const hasError = deteleImage(req.body.image) 
      if(hasError) {
        console.log(hasError.message)
        return {
          isValid: false,
          msg: 'Error al remover la imagen guardada'
        } 
      }
      return {
        isValid: false,
        msg: `Ya existe el item ${req.body.name} en esa categoría`
      }
    }
  } catch (error) {
    console.log(error)
    const hasError = deteleImage(req.body.image) 
    if(hasError) {
      console.log(hasError.message)
      return {
        isValid: false,
        msg: 'Error al remover la imagen guardada'
      } 
    }
    return {
      isValid: false,
      msg: 'Error al validar el item con el nombre: '+req.body.name 
    }
  }
}

module.exports = { roomValidator }