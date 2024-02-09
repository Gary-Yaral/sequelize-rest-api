/* const { createToken, verifyToken } = require('../utils/jwt') */

const Role = require('../models/roleModel')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { createToken } = require('../utils/jwt')

async function refresh(req, res) {
  try {
    const user = req.user
    const userId = user.data.User.id 
    // Hacemos la consulta
    let foundUser = await UserRoles.findAll({
      include: [User, Role],
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
      Role: foundUser.Role.dataValues
    })
    return res.json({token})
  } catch (error) {
    res.json({ error: error.message })
  }
}

module.exports = {
  refresh
}