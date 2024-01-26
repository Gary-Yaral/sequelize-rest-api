const Role = require('../models/roleModel')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const db_constants = require('../constants/db_constants')
const { validateHash } = require('../utils/bcrypt')
const { createToken } = require('../utils/jwt')

async function getOnlySuperAdmins(req, res) {
  try {
    const users = await UserRoles.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role
      ],
      where: {
        rolId: db_constants.ROLES.SUPER_ADMIN
      }
    })
    res.json(users) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.status(500).json({ mensaje: 'Has been error', error: error.message })
  }
}

async function getOnlyAdmins(req, res) {
  try {
    const users = await UserRoles.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role
      ],
      where: {
        rolId: db_constants.ROLES.ADMIN
      }
    })
    res.json(users) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.status(500).json({ mensaje: 'Has been error', error: error.message })
  }
}

async function getOnlyUsers(req, res) {
  try {
    const users = await UserRoles.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role
      ],
      where: {
        rolId: db_constants.ROLES.USER
      }
    })
    res.json(users) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.status(500).json({ mensaje: 'Has been error', error: error.message })
  }
}

async function getAuth(req, res) {
  try {
    const username = req.body.username
    const password = req.body.password
    // Si no se envian los datos enviará un msg de error
    if(!username || !password) {
      return res.status(401)
        .json({ 
          error: 'No se han recibido datos de acceso', 
        })
    }
    // Hacemos la consulta
    let foundUser = await UserRoles.findAll({
      include: [User, Role],
      where: {
        '$User.user$': username}
    })
    // Si no existe el usuario devuelve error
    if(foundUser.length === 0) {
      return res.status(401)
        .json({ 
          error: 'Usuario o contraseña incorrectos', 
        })
    }
    // Solo escogemos el primer resultado
    foundUser = foundUser[0]
    // Extraemos el hash de la consulta
    const hash = foundUser.User.dataValues.password
    // Validamos la contraseña
    const hasAuth = await validateHash(password, hash)
    if(!hasAuth) {
      return res.status(401)
        .json({ 
          error: 'Usuario o contraseña incorrectos', 
        })
    }
    // Removemos la contraseña del objeto de respuesta
    delete foundUser.User.dataValues.password
    // Creamos el token
    const token = createToken({
      User: foundUser.User.dataValues,
      Role: foundUser.Role.dataValues
    })
    // Añadimos el token a los datos de la sesión
    foundUser.dataValues.token = token
    // Restornamos los datos de la sesión
    res.json(foundUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getOnlySuperAdmins,
  getOnlyAdmins,
  getOnlyUsers,
  getAuth
}