const sequelize = require('../database/config')
const { Op, json } = require('sequelize')
const ChairType = require('../models/chairTypeModel')
const { deteleImage } = require('../utils/deleteFile')
const { getErrorFormat } = require('../utils/errorsFormat')
const Item = require('../models/item.model')
const Category = require('../models/category.model')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const created = await Item.create({
      name: req.body.name.toUpperCase(),
      price: req.body.price,
      description: req.body.description,
      categoryId: req.body.category,
      image: req.body.image
    })

    if(created) {
      return res.json({done: true, msg: 'Item guardado correctamente'})
    } else {
      transaction.rollback()
      const hasError = deteleImage(req.body.image)
      if(hasError.error) {
        return json({error: true, msg: hasError.message})
      }
      return json({error: true, msg: 'No se pudo guardar el item'})
    }
  } catch (error) {
    console.log(error)
    return json({error: true, msg: 'Error al guardar el item'})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    if(req.body.image === '' || !req.body.image) {
      delete req.body.image
    }
    // Convertimos a mayusculas el nombre
    req.body.name = req.body.name.toUpperCase()
    // Actualizamos los datos
    await Item.update(req.body, {where: {id: req.params.id}}, {transaction})
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
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar el item' })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    //Extraemos el id de registro encontrado
    let { id, image } = req.body.found
    // si existe lo eliminamos
    const affectedRows = await Item.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'No pudo eliminar el item' })
    }
    // Si todo ha ido bien
    const hasError = deteleImage(image)
    if(hasError) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar imagen del item' })
    }
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
    return res.json({
      result: true,
      message: 'Item eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al eliminar el item' })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const data = await Item.findAndCountAll({
      include: [Category],
      raw: true,
      limit: perPage,
      offset: (currentPage - 1) * perPage
    })
    return res.json({
      result: true,
      data
    })
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'No se pudo cargar los datos'})
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
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

async function getAll(req, res) {
  try {
    const data = await ChairType.findAll()
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

module.exports = {
  add,
  update,
  remove,
  paginate, 
  filterAndPaginate,
  getAll
}