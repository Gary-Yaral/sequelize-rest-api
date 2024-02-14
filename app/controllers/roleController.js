const dbConstants = require('../constants/db_constants')
const Role = require('../models/roleModel')
const { Op } = require('sequelize')

async function getAll(req, res) {
  try {
    const roleId = req.user.data.Role.id
    // Si es administrador solo podrá darle el rol de usuario a los usuarios que registre 
    if(roleId === dbConstants.ROLES.ADMIN) {
      const role = await Role.findAll({
        where:{
          id: dbConstants.ROLES.USER
        }
      })
      return res.json({data: role})
    }
    // Si es administrador podrá darle roles de ADMIN y USUARIO
    if(roleId === dbConstants.ROLES.SUPER_ADMIN) {
      const role = await Role.findAll({
        where:{
          id: {[Op.not]: dbConstants.ROLES.SUPER_ADMIN}
        }
      })
      return res.json({data: role})
    }

    return res.json({
      error: 'No se ha podido obtener lista de roles'
    })
  } catch (error) {
    return res.json({error})
  }
}

module.exports = {
  getAll
}