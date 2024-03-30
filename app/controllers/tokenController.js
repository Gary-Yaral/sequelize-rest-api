/* const { createToken, verifyToken } = require('../utils/jwt') */

const Role = require('../models/roleModel')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { getErrorFormat } = require('../utils/errorsFormat')
const { createToken, OPTIONS_TOKEN } = require('../utils/jwt')

async function refresh(req, res) {
  try {
    const userId = req.user.data.User.id
    console.log(req.user)
    // Hacemos la consulta
    let foundUser = await UserRoles.findAll({
      include: [
        User, 
        {
          model: Role,
          include: [UserRoles]
        }
      ],
      where: {
        '$User.id$': userId
      }
    })
    // Si el usuario no existe retornamos un error
    if(!(foundUser.length > 0) ){
      return res.json({error: 'No existe el usuario del token proporcionado'})
    }
    // Escogemos el primer indice
    foundUser = foundUser[0]
    // Removemos la contraseña del objeto de respuesta
    delete foundUser.User.dataValues.password
    // Creamos el nuevo token
    const token = createToken({
      User: foundUser.User.dataValues,
      Role: foundUser.Role.dataValues,
      UserRole: foundUser.Role.UserRoles[0].dataValues
    }, OPTIONS_TOKEN.create)
    return res.json({token})
  } catch (error) {
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

module.exports = {
  refresh
}