const sequelize = require('../database/config')
const ChairType = require('../models/chairTypeModel')
const { wasReceivedAllProps } = require('../utils/propsValidator')

const requiredProps = ['type', 'price', 'description']

async function add(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, requiredProps)){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    const user = await ChairType.create(req.body, {transaction})

    // Si todo salio bien se guardan cambios
    if(user.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Tipo de Silla registrado correctamente'
      })
    }
    // Si no se guardaron los dos
    await transaction.rollback()
    return res.json({
      result: false,
      message: 'No se pudo registrar el tipo de silla'
    })
  } catch (error) {
    res.status(500).json({message: 'Error al crear tipo de silla', error})
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

    // Actualizamos los datos
    const [updatedRows] = await ChairType.update(req.body, {where: {id: req.body.id}}, {transaction})

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
      message: 'Tipo de silla actualizado correctamente'
    })
   
  } catch (error) {
    res.status(500).json({message: 'Error al actualizar tipo de silla', error})
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
    const toDelete = await ChairType.findByPk(req.body.id, {transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(!toDelete) {
      return res.json({
        result: false,
        message: 'Tipo de silla no existe en el sistema'
      })
    }
    //Extraemos el id de registro encontrado
    const { id } = toDelete.dataValues
    // si existe lo eliminamos
    const affectedRows = await ChairType.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'Tipo de silla no se pudo eliminar del sistema'
      })
    }
    // Si todo ha ido bien
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Tipo de silla eliminado correctamente'
    })
  } catch (error) {
    res.status(500).json({message: 'Error al eliminar tipo de silla', error})
  }
}

async function getAll(req, res) {
  try {
    const all = await ChairType.findAll()   
    return res.json({
      result: true,
      data: all
    })
  } catch (error) {
    res.status(500).json({message: 'Error al consultar los datos', error})
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll
}