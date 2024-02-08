const db_constants = require('../constants/db_constants')
const sequelize = require('../database/config')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { generateHash } = require('../utils/bcrypt')
const { wasReceivedAllProps } = require('../utils/propsValidator')

const requiredProps = ['dni', 'name', 'lastname', 'email', 'username', 'telephone', 'password']

async function add(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, requiredProps)){
      return res.json({ 
        error: 'No se han recibido todos los campos', 
      })
    }

    // Creamos el hash
    req.body.password =  await generateHash(req.body.password)
    const user = await User.create(req.body, {transaction})
    // Le agregamos sus rol de usuario
    const roleData = {
      userId: user.id,
      roleId: db_constants.ROLES.SUPER_ADMIN,
      statusId: db_constants.USER_STATUS.ACTIVO
    }
    // Asignamos el rol a ese usuario que creó
    const role =  await UserRoles.create(roleData, {transaction})

    // Si todo salio bien se guardan cambios
    if(user.id && role.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Usuario registrado correctamente'
      })
    }
    // Si no se guardaron los dos
    await transaction.rollback()
    return res.json({
      result: false,
      message: 'No se pudo registrar el usuario'
    })
  } catch (error) {
    if(error.errors && Array.isArray(error.errors)) {
      if(error.errors[0].type === 'unique violation') {
        const path = error.errors[0].path
        if(path === 'dni') {
          return res.status(500).json({ error: 'Ya existe otro usuario con esa cédula'})
        }
        if(path === 'username') {
          return res.status(500).json({ error: `Ya existe el usuario: ${req.body.username}` })
        }
      }
    }

    res.status(500).json({message: 'Error al crear usuario', error})
  }
}

async function update(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, [...requiredProps, 'id'])){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    // Extraemos los campos
    const attrs = Object.keys(req.body)
    attrs.forEach(prop => {
      if(req.body[prop] === '') {
        delete req.body[prop]
      }
    })

    // Si existe contraseña creamos el hash
    if(req.body.password) {
      req.body.password =  await generateHash(req.body.password)
    }
    // Actualizamos los datos
    const [updatedRows] = await User.update(req.body, {where: {id: req.body.id}}, {transaction})

    // Devolvemos error en caso de que no hubo cambios
    if(updatedRows === 0) {
      // Si no se pudo guardar
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'No se realizó cambios. Los datos recibidos son similares a los registrados'
      })
    }

    await transaction.commit() 
    return res.json({
      result: true,
      message: 'Usuario actualizado correctamente'
    })
   
  } catch (error) {
    if(error.errors && Array.isArray(error.errors)) {
      if(error.errors[0].type === 'unique violation') {
        const path = error.errors[0].path
        if(path === 'dni') {
          return res.status(500).json({ error: 'Ya existe otro usuario con esa cédula'})
        }
        if(path === 'username') {
          return res.status(500).json({ error: `Ya existe el usuario: ${req.body.username}` })
        }
      }
    }

    res.status(500).json({message: 'Error al actualizar usuario', error})
  }
}

async function remove(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, ['id'])){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }
    // Extraemos los campos
    if(req.body.id === '') {
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }
    // Buscamos el registro a eliminar
    const userToDelete = await User.findByPk(req.body.id, {transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(!userToDelete) {
      return res.json({
        result: false,
        message: 'Usuario no existe en el sistema'
      })
    }
    //Extraemos el id de registro encontrado
    const { id } = userToDelete.dataValues
    // si existe lo eliminamos
    const affectedRows = await User.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'Usuario no se pudo eliminar del sistema'
      })
    }
    // Si todo ha ido bien
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Usuario eliminado correctamente'
    })
  } catch (error) {
    res.status(500).json({message: 'Error al actualizar usuario', error})
  }
}

module.exports = {
  add,
  update,
  remove
}