const sequelize = require('../database/config')
const SequelizeORM = require('sequelize')
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
const { v4: uuidv4 } = require('uuid')
const { ROLES, PACKAGE_TYPES } = require('../constants/db_constants')
const PackageType = require('../models/packageTypeModel')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // Generar UUID
    const uuid = uuidv4()
    // Obtener marca de tiempo actual
    const timestamp = Date.now()
    // Creamos el codigo del paquete combinando uuid y timestamp
    const code = `${uuid}-${timestamp}`
    // Extreamos el rol de usuario que envia la información
    const roleId = req.user.data.Role.id
    // Definimos como paquete de tipo usuario por defecto
    let typeId = PACKAGE_TYPES.USER
    // Verificamos si de pronto tiene rol de administrador
    if(roleId === ROLES.ADMIN || roleId === ROLES.SUPER_ADMIN) {
      typeId = PACKAGE_TYPES.ADMIN
    }
    // Creamos la data del paquete
    let name = req.body.name
    let packData = {code, typeId, name}
    // Extraemos el nombre que le pondremos al paquete
    if(!name) { delete packData.name }
    // Creamos el paquete
    const pack = await Package.create(packData, {transaction})
    // Si no se creó el paquete retornamos error
    if(!pack) {
      transaction.rollback()
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error al guardar registro 1', errorName) }
      let errorKeys = [errorName]
      return res.status(400).json({ errors, errorKeys }) 
    }
    
    // Extaremos el id del paquete para añadirselo a todos los registros
    let { id } = pack
    // Eliminamos name del body para luego poder preparar los datos
    delete req.body.name
    // Creamos los objetos que se guardaran y le añadimos el id del paquete
    prepareItems(req, id)
    /* transaction.rollback()
     return  res.json({result: false, body: req.body}) */
    // Hacemos los inserciones
    // MESAS
    if(req.body.tables) {
      await TableDetail.bulkCreate(req.body.tables, {transaction})
    }
    // SILLAS
    if(req.body.chairs) {
      await ChairDetail.bulkCreate(req.body.chairs, {transaction})
    }
    // DECORACIONES
    if(req.body.decorations) {
      await DecorationDetail.bulkCreate(req.body.decorations, {transaction})
    }
    // BEBIDAS
    if(req.body.drinks) {
      await DrinkDetail.bulkCreate(req.body.drinks, {transaction})
    }
    // COMIDAS
    if(req.body.dishes) {
      await DishDetail.bulkCreate(req.body.dishes, {transaction})
    }
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Paquete ha sido creado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al guardar registro 2', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

function prepareItems(req, packageId) {
  console.log(req.body)
  let categories = Object.keys(req.body)
  categories.forEach((category)=>{
    req.body[category].forEach((item, i) => {
      req.body[category][i].packageId = packageId
    })
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
    const data = await Package.findAndCountAll({
      include: [PackageType],
      raw: true,
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
      include: [PackageType],
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
    const data = await Package.findAndCountAll(filterCondition)
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
      include: [{ model: DishDetail, include: [Dish] }],
      attributes: [
        // Utiliza sequelize.literal() para calcular la suma total de la columna "total" de DishDetail
        [SequelizeORM.literal('SUM(`DishDetails`.`total`)'), 'totalDetails'],
      ],
    })
    const tables = await Package.findAll({
      include: [{ model: TableDetail, include: [TableType] }],
    })
    const chairs = await Package.findAll({
      include: [{
        model: ChairDetail,
        as: 'ChairDetails',
        attributes: [[SequelizeORM.fn('SUM', SequelizeORM.col('total')), 'total']]
      }],
      group: ['Package.id'],
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
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

async function findOne(req, res) {
  try {
    let { packageId } = req.data
    const dishes = await Package.findAll({
      include: [{ model: DishDetail, include: [Dish], where: {id: packageId}}]
    })
    const tables = await Package.findAll({
      include: [{ model: TableDetail, include: [TableType], where: {id: packageId}}],
    })
    const chairs = await Package.findAll({
      include: [{ model: ChairDetail, include: [ChairType], where: {id: packageId}}],
    })
    const decorations = await Package.findAll({
      include: [{ model: DecorationDetail, include: [DecorationType], where: {id: packageId}}],
    })
    const drinks = await Package.findAll({
      include: [{ model: DrinkDetail, include: [Drink], where: {id: packageId}}],
    })
    return res.json({
      result: true,
      data: { dishes, tables, chairs, decorations, drinks}
    })
  } catch (error) {
    console.log(error)
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
  getAll,
  findOne
}