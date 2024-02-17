const sequelize = require('../database/config')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { generateHash } = require('../utils/bcrypt')
const { wasReceivedAllProps, hasEmptyFields } = require('../utils/propsValidator')

const requiredProps = [
  'dni', 'name', 'lastname', 'email', 'role', 'status', 'username', 'telephone', 'password'
]

async function add(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, requiredProps)){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }
    // Verificamos que no haya propiedades en blanco
    if(hasEmptyFields(req) > 0){
      return res.json({ 
        error: 'Se han recibido campos vacios', 
      })
    }

    // Creamos el hash
    req.body.password =  await generateHash(req.body.password)
    // Convertimos a mayusculas el nombre y apellido
    req.body.name = req.body.name.toUpperCase()
    req.body.lastname = req.body.lastname.toUpperCase()
    const user = await User.create(req.body, {transaction})
    // Le agregamos sus rol de usuario
    const roleData = {
      userId: user.id,
      roleId: req.body.role,
      statusId: req.body.status
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
          return res.json({ error: 'Ya existe otro usuario con esa cédula'})
        }
        if(path === 'username') {
          return res.json({ error: `Ya existe el usuario: ${req.body.username}` })
        }
      }
    }

    res.json({message: 'Error al crear usuario', error})
  }
}

async function update(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, requiredProps) || !req.params.id || !req.params.roleId){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    //Verificamos si existe ese usuario
    // Buscamos el tipo de silla
    const found = await User.findOne({
      where: {
        id: req.params.id
      }
    })
    // Si no existe el tipo de silla retornamos error
    if(!found) {
      return res.json({
        result: false,
        message: 'No existe ese usuario'})
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
    let updatedRows = await User.update(req.body, {where: {id: req.params.id}}, {transaction})
    console.log(updatedRows)

    // Devolvemos error en caso de que no hubo cambios
    if(updatedRows === 0) {
      // Si no se pudo guardar
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'No se realizó cambios. Los datos recibidos son similares a los registrados'
      })
    }
    // Le agregamos sus rol de usuario
    const roleData = {
      roleId: req.body.role,
      statusId: req.body.status
    }


    // Actualizamos los datos
    updatedRows = await UserRoles.update(roleData, {where: {id: req.params.roleId}}, {transaction})
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