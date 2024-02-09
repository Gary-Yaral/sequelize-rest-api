const sequelize = require('../database/config')
const ChairType = require('../models/chairTypeModel')
const { deteleImage } = require('../utils/deleteFile')
const { wasReceivedAllProps, hasEmptyFields, wasReceivedProps } = require('../utils/propsValidator')

const requiredProps = ['type', 'price', 'description', 'image']

async function add(req, res) {
  try {
    // Iniciamos la transacción
    const transaction = await sequelize.transaction()
    // Varificamos que lleguen todas las prpiedades
    if(!wasReceivedAllProps(req, requiredProps)){
      return res.json({ 
        error: 'No se han recibido todos los campos', 
      })
    }
    // Verificamos que no haya propiedades en blanco
    if(hasEmptyFields(req) > 0){
      return res.json({ 
        error: 'Se han recibido campos vacios', 
      })
    }
    // Insertamos el registro en el modelo
    const user = await ChairType.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios en la base de datos
    if(user.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Tipo de Silla registrado correctamente'
      })
    }
    // SI NO SE INSERTÓ EL REGISTRO
    // eliminamos la imagen que guardamos
    const imageWasDeleted = deteleImage(req.body.image) 
    // Si no se pudo eliminar la imagen que guardamos devolvemos error
    if(imageWasDeleted.error) {
      await transaction.rollback()
      return res.json({ error:imageWasDeleted.message })
    }

    // Una vez eliminada la imagen deshacemos los cambios y devolvemos error
    await transaction.rollback()
    return res.json({
      result: false,
      message: 'No se pudo registrar el tipo de silla'
    })
  } catch (error) {
    res.json({message: 'Error al crear tipo de silla', error})
  }
}

async function update(req, res) {
  try {
    // Creamos la transacción
    const transaction = await sequelize.transaction()
    // Verificams que nos enviaron todas las propiedades y el id
    if(!wasReceivedProps(req, requiredProps) || !req.params.id){
      return res.json({ 
        error: 'No se han recibido todos los campos', 
      })
    }

    // Buscamos el tipo de silla
    const found = await ChairType.findOne({
      where: {
        id: req.params.id
      }
    })
    // Si no existe el tipo de silla retornamos error
    if(!found) {
      // Eliminamos la imagen que guardamos al principio
      const deleted = deteleImage(req.body.image)
      if(deleted.error) {
        return res.json({error : deleted.message })
      } else {
        return res.json({
          result: false,
          message: 'No existe ese tipo de silla'})
      }
    }    
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    if(req.body.image === '' | !req.body.image) {
      delete req.body.image
    }
    // Actualizamos los datos
    const [updatedRows] = await ChairType.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Devolvemos error en caso de que no hubo cambios
    if(updatedRows === 0) {
      // Si no se pudo guardar
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'No se realizó cambios. Los datos recibidos son similares a los registrados'
      })
    }

    // Si todo ha ido bien guardamos los cambios en la bd
    await transaction.commit() 
    // Eliminamos la imagen anterior usando su path
    if(req.body.image) {
      const imageName = found.image 
      const imageWasDeleted = deteleImage(imageName)  
      // Si al eliminar retorna algo es porque hay error
      if(imageWasDeleted) {
        return res.json({
          error: imageWasDeleted.message
        })
      }
    }
    // Retornamos el mensaje de que todo ha ido bien
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
    if(!req.params.id){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    // Extraemos los campos
    if(req.params.id === '') {
      return res.status(401)
        .json({ 
          error: 'No se ha enviado el id del registro', 
        })
    }
    // Buscamos el registro a eliminar
    const toDelete = await ChairType.findByPk(req.params.id, {transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(!toDelete) {
      return res.json({
        result: false,
        message: 'Tipo de silla no existe en el sistema'
      })
    }
    //Extraemos el id de registro encontrado
    const { id, image } = toDelete.dataValues
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
    const imageWasDeleted = deteleImage(image)
    if(imageWasDeleted) {
      return res.json({
        error: imageWasDeleted.error
      })
    }
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
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
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const data = await ChairType.findAndCountAll({
      limit: perPage,
      offset: (currentPage - 1) * perPage
    })
    return res.json({
      result: true,
      data
    })
  } catch (error) {
    res.json({error})
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll
}