const sequelize = require('../database/config')
const { Op } = require('sequelize') 
const { getErrorFormat } = require('../utils/errorsFormat')
const Package = require('../models/package.model')
const PackageStatus = require('../models/packageStatus.model')
const Item = require('../models/item.model')
const PackageDetail = require('../models/packageDetail.model')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {   
    // Se crea la data del paquete
    const packData = {
      userRoleId: req.user.data.UserRole.id,
      status: req.body.status,
      name: req.body.name.toUpperCase()
    }
    // Creamos el paquete
    const createdPackage = await Package.create(packData, {transaction})
    // Si no se creó el paquete retornamos error
    if(!createdPackage) {
      transaction.rollback()
      return res.json({ error: true, msg: 'Error al guardar el paquete: ' + req.body.name})
    }
    const currentDate = new Date()
    // Añadimos el id del paquete a todos los elementos y los tranformamos
    req.body.items = req.body.items.map((item) => {
      return {
        itemId: item.id,
        packageId: createdPackage.id,
        date: currentDate,
        ...item
      }
    })
    // Hacemos los inserciones
    await PackageDetail.bulkCreate(req.body.items, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Paquete ha sido creado correctamente'
    })
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar el registro' })
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Creamos la data que actualizará el paquete
    const packData = {
      userRoleId: req.user.data.UserRole.id,
      status: req.body.status,
      name: req.body.name.toUpperCase()
    }
    console.log(req.params)
    const updated = await Package.update(packData, {where: {id: req.params.id}}, {transaction})
    if(!updated) {
      transaction.rollback()
      return res.json({error: true, msg: 'Error al actualizar datos del paquete'})
    }

    // Eliminamos los registros que ya tenia
    await PackageDetail.destroy({ where: { packageId: req.params.id }, transaction})
    // Obtenemos la fecha actual
    const currentDate = new Date()
    // Añadimos el id del paquete a todos los elementos y los tranformamos
    req.body.items = req.body.items.map((item) => {
      return {
        itemId: item.id,
        packageId: req.params.id,
        date: currentDate,
        ...item
      }
    })
    // Hacemos los inserciones
    await PackageDetail.bulkCreate(req.body.items, {transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Paquete ha sido actualizado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar el paquete' })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // si existe lo eliminamos
    await Package.destroy({ where: { id: req.params.id }, transaction})
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
    return res.json({
      result: true,
      message: 'Paquete eliminado correctamente'
    })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.status(400).json({ error: true, msg: 'Error al eliminar el paquete' })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    let sectionData = await Package.findAndCountAll({
      include: [PackageStatus],
      where: {
        userRoleId: req.user.data.UserRole.id
      },
      raw: true,
      limit: perPage,
      offset
    })
    return res.json({ result: true, data: sectionData })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al paginar los paquetes' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const offset = (currentPage - 1) * perPage
    let sectionData = await Package.findAndCountAll({
      include: [PackageStatus],
      where: {
        userRoleId: req.user.data.UserRole.id,
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { '$PackageStatus.status$': { [Op.like]: `%${filter}%` } }
        ]
      },
      raw: true,
      limit: perPage,
      offset
    })
    return res.json({ result: true, data: sectionData })
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los paquetes' })
  }
}

async function findOne(req, res) {
  const found = await Package.findOne({where: {id: req.params.id}})
  return res.json({data: found})
}

async function getSectionData(req, res) {
  try {
    let sectionData = await Item.findAll({
      where: {
        subcateoriId: req.params.id
      },
      raw: true
    })
    return res.json({ data: sectionData })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al cargar la sección' })
  }
}

async function getSavedData(req, res) {
  try {
    let details = await PackageDetail.findAll({
      include: [{
        model: Item,
        attributes: ['description', 'image', 'name'],
        prefixed: false
      }],
      attributes: [
        ['itemId', 'id'],
        'quantity',
        'price',
      ],
      where: {
        packageId: req.params.id
      },
      raw: true,
    })

    details = details.map((row) => {
      // Eliminar el prefijo del modelo del nombre del campo 'description'
      if (row['Item.description']) {
        row.description = row['Item.description']
        delete row['Item.description']
      }
  
      // Eliminar el prefijo del modelo del nombre del campo 'image'
      if (row['Item.image']) {
        row.name = row['Item.name']
        delete row['Item.name']

      }
      // Eliminar el prefijo del modelo del nombre del campo 'image'
      if (row['Item.image']) {
        row.image = row['Item.image']
        delete row['Item.image']

      }

      return row
    })
    return res.json({ data: details })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al cargar los datos guardados' })
  }
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


module.exports = {
  add,
  update,
  remove,
  paginate, 
  getSavedData,
  getSectionData,
  findOne,
  filterAndPaginate,
  getStatuses,
}