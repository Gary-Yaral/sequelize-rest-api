const sequelize = require('../database/config')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { generateHash } = require('../utils/bcrypt')
const { wasReceivedAllProps, getPropsOfQuery, hasEmptyFields, areEquals, extractProperties, extractPropsAndRename } = require('../utils/propsValidator')

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
    const found = await UserRoles.findOne({ 
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        }
      ],
      raw: true,
      where: { userId: req.params.id }
    })
    // Convertimos a mayusculas el nombre y apellido
    req.body.name = req.body.name.toUpperCase()
    req.body.lastname = req.body.lastname.toUpperCase()
    // Obtenemos los datos del USUARIO para comparar y guardar
    const userProps = requiredProps.filter(prop => prop !== 'role' && prop !== 'status')
    const newUserData = extractProperties(req.body, userProps)
    const currentUserData = getPropsOfQuery('User', found)
    // Obtenemos los datos del ROL de usuario para comparar y guardar
    const { roleId, statusId } = found
    const currentRoleData = {roleId, statusId}
    const newRoleData = extractPropsAndRename(req.body, ['role', 'status'],['roleId', 'statusId'])
    const userRoleInfoIsSame = areEquals(newRoleData, currentRoleData)
    // Validadores de que se actualizaron los datos
    let errors = {}  
    // Si la contraseña viene vacia entonces verificamos si la información recibida es la misma
    if(req.body.password === ''){
      delete newUserData.password
      // Extramos solo los datos del usuario
      const userInfoIsSame = areEquals(newUserData, currentUserData)
      // Si la informacion es diferente actualizamos
      if(!userInfoIsSame) {
        errors.user = await updateUser(req.params.id, newUserData, transaction)
      }
    } else {
      // Si la contraseña existe creamos el hash
      newUserData.password =  await generateHash(req.body.password)
      // Actualizamos los datos del usuario porque si habran filas afectadas
      errors.user = await updateUser(req.params.id, newUserData, transaction)    
    }
    // Actualizamos el rol solo si la información es diferente
    if(!userRoleInfoIsSame) {
      errors.role = await updateUserRole(req.params.roleId, newRoleData, transaction)
    }
    // Verificamos si hubo error al actualizar el usuario
    if(errors.user) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: errors.user.message
      })
    } 
    // Verificamos si hubo error al actualizar el rol del usuario
    if(errors.role) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: errors.role.message
      })
    }  
    // Si todo ha ido bien guardamos los cambios
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
          return res.json({ result: false, message: 'Ya existe otro usuario con esa cédula'})
        }
        if(path === 'username') {
          return res.json({ result: false, message: `Ya existe el usuario: ${req.body.username}` })
        }
      }
    }

    res.json({message: 'Los datos no se actualizado por error desconocido', error})
  }
}

async function updateUser(id, data, transaction) {
  // Actualizamos los datos del usuario
  let [affectedRows] = await User.update(data, {where: {id}}, {transaction})
  if(affectedRows === 0) {
    // Recibieron la misma informacion que ya tenia por lo que no se guarda ningun cambio
    await transaction.rollback()
    return {
      message: 'Error al actualizar los datos del usuario'
    }
  }
}

async function updateUserRole(id, data, transaction) {
  let [affectedRows] = await UserRoles.update(data, {where: {id}}, {transaction})
  if(affectedRows === 0) {
    // Recibieron la misma informacion que ya tenia por lo que no se guarda ningun cambio
    await transaction.rollback()
    return {
      message: 'Error al actualizar el rol del usuario'
    }
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