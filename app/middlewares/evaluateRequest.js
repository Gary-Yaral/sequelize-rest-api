const { validationResult } = require('express-validator')
const { deteleImage } = require('../utils/deleteFile')

// Función de middleware personalizada para validar las solicitudes
const validateRequest = (req, res, next) => {
  // Obtener los resultados de la validación
  const errors = validationResult(req)

  // Verificar si hay errores de validación
  if (!errors.isEmpty()) {
    const groupedData = errors.array().reduce((acc, obj) => {
      const key = obj.path
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})

    // Si hay imagen guardada la eliminamos
    if(req.body.image) {
      if(req.body.image !== '' && req.body.image !== null) {
        deteleImage(req.body.image)
      }  
    }
    // Si hay errores, retornar una respuesta con el código de estado 400 y los errores encontrados
    return res.status(400).json({ errors: groupedData, errorKeys: Object.keys(groupedData) })
  }

  // Si no hay errores, continuar con el siguiente middleware
  next()
}

module.exports = { validateRequest } 