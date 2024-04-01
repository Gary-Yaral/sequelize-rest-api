const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const Category = require('../models/category.model.js')

const categoryValidator = [
  check('name')
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
    // Verificamos si ya existe un item con ese nombre y esa categoria
    let found = await Category.findAll({
      where: {
        name: req.body.name.toUpperCase(),
      },
      raw: true
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
        return {
          isValid: false,
          msg: `Ya existe la categoría: ${req.body.name}`
        }
      }
    } else {
      // Si está intentando guardar una categoría repetida
      return {
        isValid: false,
        msg: `Ya existe la categoría: ${req.body.name.toUpperCase()}`
      }
    }
  } catch (error) {
    console.log(error)
    return {
      isValid: false,
      msg: 'Error al validar la categoria: '+req.body.name.toUpperCase() 
    }
  }
}

module.exports = { categoryValidator }