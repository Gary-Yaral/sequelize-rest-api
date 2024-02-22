const sequelize = require('../database/config')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { generateHash } = require('../utils/bcrypt')
const { wasReceivedAllProps, hasEmptyFields, hasSameValue } = require('../utils/propsValidator')

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
    const found = await User.findOne({ where: { id: req.params.id }})
    // Si no existe el usuario retornamos error
    if(!found) {
      return res.json({ result: false,  message: 'No existe ese usuario'})
    }      
    // Eliminamos los campos que vengan vacios
    const attrs = Object.keys(req.body)
    attrs.forEach(prop => {
      if(req.body[prop] === '') { delete req.body[prop] }
    })
    // Comparamos los datos del usuario para ver si son iguales a los que ya tiene
    let isSameUserInfo = hasSameValue(req.body, found, ['role', 'status'])
    // Si existe contraseña creamos el hash
    if(req.body.password) {
      req.body.password =  await generateHash(req.body.password)
    }
    // Convertimos a mayusculas el nombre y apellido
    req.body.name = req.body.name.toUpperCase()
    req.body.lastname = req.body.lastname.toUpperCase()
    // Actualizamos los datos del usuario
    let [updatedUserRows] = await User.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Consultamos el rol de usuario para compararlo
    const foundRole = await UserRoles.findOne({where: {id: req.params.roleId}})
    // Creamos objeto con los nuevos datos del rol del ususario
    const {role, status} = req.body
    const roleData = { roleId: role, statusId: status } 
    // Verificamos si la info es la misma que ya tiene guardada
    let isSameUserRoleInfo = hasSameValue(roleData, foundRole)
    // Actualizamos los datos del rol del usuario
    let [updatedRoleRows] = await UserRoles.update(roleData, {where: {id: req.params.roleId}}, {transaction})
    //Verificamos si tenemos que guardar los cambios, revisando si las datos fueron diferentes
    const userWasUpdated = updatedUserRows === 0 && isSameUserInfo
    const userRoleWasUpdated = updatedRoleRows === 0 && isSameUserRoleInfo
    if(userWasUpdated && userRoleWasUpdated) {
      // Recibieron la misma informacion que ya tenia por lo que no se guarda ningun cambio
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'Usuario actualizado correctamente'
      })
    }
    // Guardamos los cambios
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
          return res.json({ error: 'Ya existe otro usuario con esa cédula'})
        }
        if(path === 'username') {
          return res.json({ error: `Ya existe el usuario: ${req.body.username}` })
        }
      }
    }

    res.json({message: 'Error al actualizar usuario', error})
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
    res.json({message: 'Error al actualizar usuario', error})
  }
}

module.exports = {
  add,
  update,
  remove
}