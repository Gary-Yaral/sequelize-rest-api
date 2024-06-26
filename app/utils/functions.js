const User = require('../models/userModel')

async function findRepeatedUser(req, data) {
  const user = await User.findOne({ 
    attributes: { exclude: ['password'] }, 
    where: data, 
    raw:true 
  })
  if(user) {
    // Verificó si está intentando actualizar
    if(req.params.id) {
      // Si alguien mas tiene esa cedula entonces lo añadimos a los repetidos
      if(parseInt(user.id) !== parseInt(req.params.id)) {
        req.repeatedUser = true
      } else {
        // Añadimos el usuario encontrada en la request
      }
    } else {
      // Si alguien mas tiene esa cedula entonces lo añadimos a los repetidos
      req.repeatedUser = true
    }
  }
}

function parentReferenceError(error) {
  if(error.parent) {
    if(error.parent.errno && error.parent.errno === 1451) {
      return {
        parent: true,
        msg: 'No es posible eliminar este registro, tiene campos vinculados'
      }
    }
  }
  return {
    parent: false,
    msg: ''
  }
}

function getCurrentDate() {
  return new Date()
}

module.exports = { 
  parentReferenceError,
  findRepeatedUser,
  getCurrentDate
}