const sequelize = require('../database/config')
const { Op } = require('sequelize')
const ChairType = require('../models/chairTypeModel')
const { deteleImage } = require('../utils/deleteFile')
const { getErrorFormat } = require('../utils/errorsFormat')
const DishDetail = require('../models/dishDetailModel')
const Package = require('../models/packageModel')
const Dish = require('../models/dishModel')
const TableType = require('../models/tableTypeModel')
const TableDetail = require('../models/tableDetailModel')
const ChairDetail = require('../models/chairDetailModel')
const DecorationDetail = require('../models/decorationDetailModel')
const DecorationType = require('../models/decorationTypeModel')
const DrinkDetail = require('../models/drinkDetailModel')
const Drink = require('../models/drinkModel')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // Creamos el paquete
    const pack = await Package.create(req.body.package, {transaction})
    // Si no se creó el paquete retornamos error
    if(!pack) {
      transaction.rollback()
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al guardar registro', errorName) }
      let errorKeys = [errorName]
      return res.status(400).json({ errors, errorKeys }) 
    }
    // Extaremos el id del paquete para añadirselo a todos los registros
    let { id } = pack
    // Creamos los objetos que se guardaran y le añadimos el id del paquete
    prepareItems(req, id)
    // Hacemos los inserciones
    // MESAS
    await TableDetail.bulkCreate(req.body.tables, {transaction})
    // SILLAS
    await ChairDetail.bulkCreate(req.body.chairs, {transaction})
    // DECORACIONES
    await DecorationDetail.bulkCreate(req.body.decorations, {transaction})
    // BEBIDAS
    await DrinkDetail.bulkCreate(req.body.drinks, {transaction})
    // COMIDAS
    await DishDetail.bulkCreate(req.body.dishes, {transaction})
  } catch (error) {
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al guardar registro', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

function prepareItems(req, packageId) {
  let keys = Object.keys(req.body) 
  keys.forEach((key) => {
    if(key !== 'package') {
      req.body[key].map((item) => {
        return {
          itemId: item.id,
          quantity: item.quantity,
          packageId
        }
      })
    }
  })
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
    const affectedRows = await ChairType.destroy({ where: { id }, transaction})
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
    const data = await ChairType.findAndCountAll({
      limit: perPage,
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
    const dishes = await Package.findAll({
      include: [{ model: DishDetail, include: [Dish] }]
    })
    const tables = await Package.findAll({
      include: [{ model: TableDetail, include: [TableType] }],
    })
    const chairs = await Package.findAll({
      include: [{ model: ChairDetail, include: [ChairType] }],
    })
    const decorations = await Package.findAll({
      include: [{ model: DecorationDetail, include: [DecorationType] }],
    })
    const drinks = await Package.findAll({
      include: [{ model: DrinkDetail, include: [Drink] }],
    })
    return res.json({
      result: true,
      data: { dishes, tables, chairs, decorations, drinks}
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