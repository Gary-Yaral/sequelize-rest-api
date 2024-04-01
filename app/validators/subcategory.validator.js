const { check } = require('express-validator')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const Subcategory = require('../models/subcategory.model.js')

const subcategoryValidator = [
  check('name')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('categoryId')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => !isNaN(parseInt(value))).withMessage(customMessages['number.int']),
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
    console.log(req.body)
    let found = await Subcategory.findAll({
      where: {
        name: req.body.name.toUpperCase(),
        categoryId: req.body.categoryId
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
          msg: `Ya existe la subcategoría: ${req.body.name}`
        }
      }
    } else {
      // Si está intentando guardar una categoría repetida
      return {
        isValid: false,
        msg: `Ya existe la subcategoría: ${req.body.name.toUpperCase()}`
      }
    }
  } catch (error) {
    console.log(error)
    return {
      isValid: false,
      msg: 'Error al validar la subcategoria: '+req.body.name.toUpperCase() 
    }
  }
}

module.exports = { subcategoryValidator }