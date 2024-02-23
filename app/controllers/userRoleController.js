const Role = require('../models/roleModel')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const DB_CONSTANTS = require('../constants/db_constants')
const { validateHash } = require('../utils/bcrypt')
const { createToken } = require('../utils/jwt')
const { Op } = require('sequelize')
const UserStatus = require('../models/userStatusModel')

async function filterAndPaginate(req, res) {
  try {
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const roleId = req.user.data.Role.id
    let filter = req.body.filter
    let filterCondition = {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role,
        UserStatus
      ],
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true
    } 
    // Si es super administrador podrá obtener todos menos a él mismo
    if(roleId === DB_CONSTANTS.ROLES.SUPER_ADMIN) {  
      filterCondition.where = {
        roleId: {
          [Op.not]: DB_CONSTANTS.ROLES.SUPER_ADMIN
        }
      }
    }
    // Si es solo administrador podrá obtener solo usuarios normales
    if(roleId === DB_CONSTANTS.ROLES.ADMIN) {  
      filterCondition.where = {
        roleId: DB_CONSTANTS.ROLES.USER
      } 
    }

    // Para que busque cualquier coincidencia en esos campos
    filterCondition.where[Op.or] = [
      { '$User.dni$': { [Op.like]: `%${filter}%` } },
      { '$User.name$': { [Op.like]: `%${filter}%` } },
      { '$User.lastname$': { [Op.like]: `%${filter}%` } },
      { '$User.email$': { [Op.like]: `%${filter}%` } },
      { '$User.telephone$': { [Op.like]: `%${filter}%` } },
      { '$Role.role$': { [Op.like]: `%${filter}%` } },
      { '$UserStatus.name$': { [Op.like]: `%${filter}%` } }
    ]

    const data = await UserRoles.findAndCountAll(filterCondition)
    return res.json({
      result: true, 
      data
    })
  } catch(error) {
    res.json({error})
  }
}

async function getAll(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const roleId = req.user.data.Role.id
    let filterCondition = {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role,
        UserStatus
      ],
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true
    } 
    // Si es super administrador podrá obtener todos menos a él mismo
    if(roleId === DB_CONSTANTS.ROLES.SUPER_ADMIN) {  
      filterCondition.where = {
        roleId: {
          [Op.not]: DB_CONSTANTS.ROLES.SUPER_ADMIN
        }
      }
    }
    // Si es solo administrador podrá obtener solo usuarios normales
    if(roleId === DB_CONSTANTS.ROLES.ADMIN) {  
      filterCondition.where = {
        roleId: DB_CONSTANTS.ROLES.USER
      } 
    }
    const data = await UserRoles.findAndCountAll(filterCondition)
    return res.json({
      result: true, 
      data
    })
  } catch (error) {
    res.json({error})
  }
}

async function getUsers(req, res) {
  try {
    const roleId = req.user.data.Role.id
    // Si es administrador solo podrá darle el rol de usuario a los usuarios que registre 
    if(roleId === DB_CONSTANTS.ROLES.SUPER_ADMIN) {
      const users = await UserRoles.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
          },
          Role,
          UserStatus
        ],
        where: {
          roleId: {
            [Op.not]: DB_CONSTANTS.ROLES.SUPER_ADMIN
          }
        },
        raw: true
      })
      return res.json({
        data: {
          rows: users
        }
      })
    }

    if(roleId === DB_CONSTANTS.ROLES.ADMIN) {
      const users = await UserRoles.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
          },
          Role,
          UserStatus
        ],
        where: {
          roleId: DB_CONSTANTS.ROLES.USER
        },
        raw: true
      })
      return res.json({
        data: {
          rows: users
        }
      })
    }
    return res.json({error: 'No se han podido cargar los usuarios'})
   
  }catch(error) {
    return res.json({error})
  }
}

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
        rolId: DB_CONSTANTS.ROLES.SUPER_ADMIN
      }
    })
    res.json(users) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.json({ mensaje: 'Has been error', error: error.message })
  }
}

async function findOne(req, res) {
  try {
    const id = req.params.id
    if(!id) {
      return res.json({error: 'No se ha enviado el id del usuario'})
    }
    const user = await UserRoles.findOne({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        Role,
        UserStatus
      ],
      where: {
        userId: id
      }
    })
    res.json(user)
  } catch (error) {
    res.json({ error: error.message })
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
        rolId: DB_CONSTANTS.ROLES.ADMIN
      }
    })
    res.json(users) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.json({ mensaje: 'Has been error', error: error.message })
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
        rolId: DB_CONSTANTS.ROLES.USER
      }
    })
    res.json(users)
  } catch (error) {
    res.json({ mensaje: 'Has been error', error: error.message })
  }
}

async function getAuth(req, res) {
  try {
    const username = req.body.username
    const password = req.body.password
    // Si no se envian los datos enviará un msg de error
    if(!username || !password) {
      return res.json({ 
        error: 'No se han recibido datos de acceso', 
      })
    }
    // Hacemos la consulta
    let foundUser = await UserRoles.findAll({
      include: [User, Role],
      where: {
        '$User.username$': username}
    })
    // Si no existe el usuario devuelve error
    if(foundUser.length === 0) {
      return res.json({ 
        error: 'Usuario o contraseña incorrectos', 
      })
    }
    // Solo escogemos el primer resultado
    foundUser = foundUser[0]
    // Si el usuario está bloqueado
    if(foundUser.dataValues.statusId === DB_CONSTANTS.USER_STATUS.BLOQUEADO) {
      return res.json({ 
        error: 'Acceso denegado. Comuniquese con el administrador', 
      })
    }
    // Si un usuario cualquiera intenta acceder
    if(foundUser.dataValues.roleId === DB_CONSTANTS.ROLES.USER){
      return res.json({ 
        error: 'Usuario o contraseña incorrectos', 
      })
    }
    // Extraemos el hash de la consulta
    const hash = foundUser.User.dataValues.password
    // Validamos la contraseña
    const hasAuth = await validateHash(password, hash)
    if(!hasAuth) {
      return res.json({ 
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
    res.json({ error: error.message })
  }
}

module.exports = {
  getOnlySuperAdmins,
  getOnlyAdmins,
  getOnlyUsers,
  getAuth,
  findOne, 
  getUsers,
  getAll,
  filterAndPaginate
}