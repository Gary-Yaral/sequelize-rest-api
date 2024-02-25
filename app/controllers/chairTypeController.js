const sequelize = require('../database/config')
const { Op } = require('sequelize')
const ChairType = require('../models/chairTypeModel')
const { deteleImage } = require('../utils/deleteFile')
const { wasReceivedAllProps, hasEmptyFields } = require('../utils/propsValidator')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
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
    // eliminamos la imagen que guardamos
    const imageWasDeleted = deteleImage(req.body.image) 
    // Si no se pudo eliminar la imagen que guardamos devolvemos error
    if(imageWasDeleted.error) {
      await transaction.rollback()
      return res.status(500).json({ error:imageWasDeleted.message })
    }
    res.status(500).json({error})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    if(req.body.image === '' || !req.body.image) {
      delete req.body.image
    }
    // Actualizamos los datos
    await ChairType.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Si todo ha ido bien guardamos los cambios en la bd
    // Eliminamos la imagen anterior usando su path
    if(req.body.currentImage) {
      const imageName = req.body.currentImage
      const hasError = deteleImage(imageName)  
      // Si al eliminar retorna algo es porque hay error
      if(hasError) {
        return res.status(500).json({
          error: hasError
        })
      }
    }
    // Retornamos el mensaje de que todo ha ido bien
    await transaction.commit() 
    return res.json({
      result: true,
      message: 'Tipo de silla actualizado correctamente'
    })
    
  } catch (error) {
    // Eliminamos la imagen que guardamos al principio
    await transaction.rollback()
    const hasError = deteleImage(req.body.image)
    if(hasError) {
      return res.status(300).json({error : hasError })
    }  
    return res.status(500).json({error})
  }
}

async function remove(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!req.params.id){
      return res.json({ 
        error: 'No se han recibido todos los campos', 
      })
    }

    // Extraemos los campos
    if(req.params.id === '') {
      return res.json({ 
        error: 'No se ha enviado el id del registro', 
      })
    }
    // Buscamos el registro a eliminar
    const toDelete = await ChairType.findByPk(req.params.id, {transaction})
    // Si no lo encontramos devolvemos mensaje de error
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
    res.json({ error })
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

async function filterAndPaginate(req, res) {
  try {
    if(!wasReceivedAllProps(req, ['currentPage', 'perPage', 'filter'])){
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
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)

    // Construir la condición de filtro
    const filterCondition = {
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true,
      where: {
        [Op.or]: [
          { type: { [Op.like]: `%${filter}%` } },
          { price: { [Op.eq]: filter } },
          { description: { [Op.like]: `%${filter}%` } }
        ]
      }
    }
    // Realizar la consulta con paginación y filtros
    const data = await ChairType.findAndCountAll(filterCondition)
    return res.json({
      result: true,
      data
    }) 
  } catch(error) {
    res.json({error})
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll, 
  filterAndPaginate
}