const sequelize = require('../database/config')
const { Op } = require('sequelize')
const Drink = require('../models/drinkModel')
const { deteleImage } = require('../utils/deleteFile')
const { getErrorFormat } = require('../utils/errorsFormat')
const DrinkType = require('../models/drinkTypeModel')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const user = await Drink.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios en la base de datos
    if(user.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Registro agregado correctamente'
      })
    }
    // SI NO SE INSERTÓ EL REGISTRO
    // eliminamos la imagen que guardamos
    const imageWasDeleted = deteleImage(req.body.image) 
    // Si no se pudo eliminar la imagen que guardamos devolvemos error
    if(imageWasDeleted) {
      await transaction.rollback()
      let errorName = 'image'
      let errors = {...getErrorFormat(errorName, 'Error al eliminar imagen guardada', errorName) }
      let errorKeys = [ errorName ]
      return res.status(400).json({ errors, errorKeys })
    }

    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al guardar registro', errorName) }
    let errorKeys = [ errorName ]
    
    // Una vez eliminada la imagen deshacemos los cambios y devolvemos error
    await transaction.rollback()
    return res.status(400).json({ errors, errorKeys })
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al guardar registro', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
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
    await Drink.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Eliminamos la imagen anterior usando su path
    if(req.body.currentImage) {
      const imageWasDeleted = deteleImage(req.body.currentImage)  
      // Si no se pudo eliminar la imagen que guardamos devolvemos error
      if(imageWasDeleted) {
        await transaction.rollback()
        let errorName = 'image'
        let errors = {...getErrorFormat(errorName, 'Error al eliminar la imagen guardada', errorName) }
        let errorKeys = [ errorName ]
        return res.status(400).json({ errors, errorKeys })
      }
    }
    // Retornamos el mensaje de que todo ha ido bien
    await transaction.commit() 
    return res.json({
      result: true,
      message: 'Registro actualizado correctamente'
    })
    
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al actualizar registro', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    //Extraemos el id de registro encontrado
    const { id, image } = req.body.found
    // si existe lo eliminamos
    const affectedRows = await Drink.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al eliminar registro', errorName) }
      let errorKeys = [ errorName ]
      return res.status(400).json({ errors, errorKeys })
    }
    // Si todo ha ido bien
    const imageWasDeleted = deteleImage(image)
    if(imageWasDeleted) {
      await transaction.rollback()
      let errorName = 'image'
      let errors = {...getErrorFormat(errorName, 'Error eliminar el registro', errorName) }
      let errorKeys = [ errorName ]
      return res.status(400).json({ errors, errorKeys })
    }
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
    return res.json({
      result: true,
      message: 'Registro eliminado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al eliminar el registro', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const data = await Drink.findAndCountAll({
      include:[DrinkType],
      limit: perPage,
      raw: true,
      offset: (currentPage - 1) * perPage
    })
    return res.json({
      result: true,
      data
    })
  } catch (error) {
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)

    // Construir la condición de filtro
    const filterCondition = {
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true,
      include: [DrinkType],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { price: { [Op.eq]: filter } },
          { description: { [Op.like]: `%${filter}%` } },
          { '$DrinkType.type$': { [Op.like]: `%${filter}%` } }
        ]
      }
    }
    // Realizar la consulta con paginación y filtros
    const data = await Drink.findAndCountAll(filterCondition)
    return res.json({
      result: true,
      data
    }) 
  } catch(error) {
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

module.exports = {
  add,
  update,
  remove,
  paginate, 
  filterAndPaginate
}