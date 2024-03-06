const sequelize = require('../database/config')
const db  = require('../database/config')
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
const PackageStatus = require('../models/packageStatusModel')

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
    let status = req.body.status
    let packData = {code, typeId, name, status}
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
    // Eliminamos name y status del body para luego poder preparar los datos
    delete req.body.name
    delete req.body.status
    // Creamos los objetos que se guardaran y le añadimos el id del paquete
    prepareItems(req, id)
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
    const { id } = req.body.found
    // si existe lo eliminamos
    await Package.destroy({ where: { id }, transaction})
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
    const offset = (currentPage - 1) * perPage
    const query = getPaginateQuery(offset, perPage) 
    const [rows] = await db.query(query)
    return res.json({
      result: true,
      data: {count: rows.length, rows}
    })
  } catch (error) {
    console.log(error)
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

    const offset = (currentPage - 1) * perPage
    const query = getPaginateQuery(offset, perPage, filter)
    const [rows] = await db.query(query)
    return res.json({
      result: true,
      data: {count:rows.length, rows}
    })
  } catch(error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

function getPaginateQuery(offset, pageSize, filter = null) {
  let query = ''
  if(filter) {
    query += `
      SELECT id, name, code, type, categories, price, status
      FROM (
    `
  }
  query  += `
    SELECT 
      CombinedItems.packageId AS id, 
      p.name, 
      p.code, 
      ptype.type, 
      CAST(CombinedItems.total_items AS INT) AS categories, 
      SUM(CombinedItems.total) AS price,
      pstatus.status
    FROM (
      SELECT 
        packageId, 
        SUM(total) AS total,
        SUM(items) AS total_items
      FROM (
        SELECT packageId, SUM(chair_detail.quantity * chair_type.price) AS total, COUNT(*) AS items 
        FROM chair_detail
        INNER JOIN chair_type
        ON chair_type.id = chair_detail.itemId
        GROUP BY packageId
        UNION ALL
        SELECT packageId, SUM(decoration_detail.quantity * decoration_type.price) AS total, COUNT(*) AS items 
        FROM decoration_detail
        INNER JOIN decoration_type
        ON decoration_type.id = decoration_detail.itemId
        GROUP BY packageId
        UNION ALL
        SELECT packageId, SUM(drink_detail.quantity * drink.price) AS total, COUNT(*) AS items 
        FROM drink_detail 
        INNER JOIN drink
        ON drink.id = drink_detail.itemId
        GROUP BY packageId
        UNION ALL
        SELECT packageId, SUM(dish_detail.quantity * dish.price) AS total, COUNT(*) AS items 
        FROM dish_detail 
        INNER JOIN dish
        ON dish.id = dish_detail.itemId
        GROUP BY packageId
        UNION ALL
        SELECT packageId, SUM(table_detail.quantity * table_type.price) AS total, COUNT(*) AS items 
        FROM table_detail 
        INNER JOIN table_type
        ON table_type.id = table_detail.itemId
        GROUP BY packageId
      ) AS TotalItems
      GROUP BY packageId
    ) AS CombinedItems
    INNER JOIN package p ON CombinedItems.packageId = p.id
    INNER JOIN package_type ptype ON p.typeId = ptype.id
    INNER JOIN package_status pstatus ON p.status = pstatus.id
    GROUP BY CombinedItems.packageId`

  if(filter) {
    query += `
    ) AS FilteredPackages
    WHERE 
        type LIKE CONCAT('%', '${filter}', '%') OR
        name LIKE CONCAT('%', '${filter}', '%') OR
        price LIKE CONCAT('%', '${filter}', '%') OR 
        code LIKE CONCAT('%', '${filter}', '%') OR 
        categories LIKE CONCAT('%', '${filter}', '%') OR
        status LIKE CONCAT('%', '${filter}', '%')
    `
  }
  query += `
    LIMIT ${pageSize} OFFSET ${offset};
    `
  return query
}

async function getStatuses(req, res) {
  try {
    let statuses = await PackageStatus.findAll()
    return res.json({
      data: { statuses }
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
    let { id } = req.params
    // Buscamos la comida
    const dishes = (await DishDetail.findAll({
      include: [Dish],
      attributes: ['quantity', 'packageId'],
      where: {packageId: id},
      raw: true
    }))
    // Buscamos las mesas
    const tables = await TableDetail.findAll({
      include: [TableType],
      attributes: ['quantity', 'packageId'],
      where: {packageId: id},
      raw: true
    })
    // Buscamos las sillas
    const chairs = await ChairDetail.findAll({
      include: [ChairType],
      attributes: ['quantity', 'packageId'],
      where: {packageId: id},
      raw: true
    })
    // Buscamos las decoraciones
    const decorations = await DecorationDetail.findAll({
      include: [DecorationType],
      attributes: ['quantity', 'packageId'],
      where: {packageId: id},
      raw: true
    })
    // Buscamos las bebidas
    const drinks = await DrinkDetail.findAll({
      include: [Drink],
      attributes: ['quantity', 'packageId'],
      where: {packageId: id},
      raw: true
    })
    // Buscamos el paquete
    return res.json({
      result: true,
      package: req.body.found,
      data: { 
        dishes: getItemsProps(dishes), 
        tables: getItemsProps(tables),
        chairs: getItemsProps(chairs), 
        decorations: getItemsProps(decorations), 
        drinks: getItemsProps(drinks)
      }
    })
  } catch (error) {
    console.log(error)
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al consultar datos', errorName) }
    let errorKeys = [errorName]
    return res.status(400).json({ errors, errorKeys })
  }
}

function getItemsProps(data) {
  return data.map((item => {
    let obj = {}
    let keys = Object.keys(item)
    for(let key of keys) {
      let k = key.split('.')
      if(k.length > 1) {
        obj[k[1]] = item[key]
      } else {
        obj[key] = item[key]
      }
    } 
    return obj 
  }))
}

module.exports = {
  add,
  update,
  remove,
  paginate, 
  filterAndPaginate,
  getStatuses,
  findOne
}