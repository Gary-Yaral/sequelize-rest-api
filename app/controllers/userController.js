const sequelize = require('../database/config')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { generateHash } = require('../utils/bcrypt')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    let { userData, userRoleData } = req.body
    // Creamos el hash
    userData.password =  await generateHash(req.body.password)
    const user = await User.create(userData, {transaction})
    // Le agregamos el id del usuario al nuevo rol que guardará
    userRoleData.userId =  user.id 
    // Guardamos el nuevo role
    await UserRoles.create(userRoleData, {transaction})
    // Guardamos los cambios
    await transaction.commit() 
    return res.json({
      result: true,
      message: 'Usuario registrado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({error})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    let { userData, userRoleData} = req.body
    if(req.body.password) {
      userData.password =  await generateHash(req.body.password)
    }
    await User.update(userData, {where: {id: req.params.id}}, {transaction})
    await UserRoles.update(userRoleData, {where: {id: req.params.roleId}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Usuario actualizado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    res.json(error)
  }
}

async function resetPassword(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // Creamos el hash
    const password =  await generateHash(req.body.password)
    // Actualizamos la contraseña
    await User.update({password}, {where: {dni: req.body.dni}}, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Usuario actualizado correctamente'
    })
    
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({error})
  }
}

async function remove(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!req.params.id){
      return res.json({ error: 'No se ha recibido el id del registro a eliminar' })
    }
    // Buscamos el registro a eliminar
    const userToDelete = await User.findOne({ where: { id: req.params.id }})
    // Si no lo encontramos devolvemos mensaje de error
    if(!userToDelete) {
      return res.json({
        result: false,
        message: 'Usuario no existe en el sistema'
      })
    }
    // Si existe el usuario entonces lo eliminamos
    const affectedRows = await User.destroy({ where: { id: req.params.id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'Usuario no se pudo eliminar del sistema'
      })
    }
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Usuario eliminado correctamente'
    })
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  add,
  update,
  remove,
  resetPassword
}