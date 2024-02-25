const { check } = require('express-validator')
const { validateRequest } = require('../middlewares/evaluateRequest.js')
const { customMessages } = require('../utils/customMessages.js')
const { textRegex } = require('../utils/regExp.js')
const ChairType = require('../models/chairTypeModel.js')
const { deteleImage } = require('../utils/deleteFile.js')

const validatorChairType = [
  check('type')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('price')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .isNumeric().withMessage(customMessages['price']),
  check('description')
    .exists().withMessage(customMessages['required'])
    .notEmpty().withMessage(customMessages['empty'])
    .custom((value) => textRegex.test(value)).withMessage(customMessages['blanks']),
  check('image')
    .optional(), 
  async (req, res, next) => {
    try {
      if(req.params.id) {
        // Si estamos actualizando
        const found = await ChairType.findOne({where: { id: req.params.id }, raw: true})
        if(found) {
          req.found = found
        } else {
          if(req.body.image) {
            // Eliminamos la imagen que guardamos al principio
            const hasError = deteleImage(req.body.image)
            if(hasError) {
              return res.status(500).json({error : hasError })
            } 
          }
          return res.status(500).json({error: 'No existe ese registro'})
        }
      } 
      // Si existe el usuario buscamos los datos actuales del rol de usuario
      validateRequest(req, res, next)
    } catch (error) {
      return res.status(500).json({error})
    }
  }
]


module.exports = {
  validatorChairType
}

