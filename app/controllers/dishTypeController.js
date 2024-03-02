const sequelize = require('../database/config')
const { Op } = require('sequelize')
const { getErrorFormat } = require('../utils/errorsFormat')
const DishType = require('../models/dishTypeModel')


async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const user = await DishType.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios en la base de datos
    if(user.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Registro agregado correctamente'
      })
    }
    // SI NO SE INSERTÓ EL REGISTRO
    await transaction.rollback()
    let errorName = 'request'
    let errors = {...getErrorFormat(errorName, 'Error al guardar registro', errorName) }
    let errorKeys = [ errorName ]   
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
    //Extraemos el id de registro encontrado
    const { id } = req.body.found
    // Actualizamos los datos
    await DishType.update(req.body, {where: {id}}, {transaction})
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
    await DishType.destroy({ where: { id }, transaction})
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
    const data = await DishType.findAndCountAll({
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
          { type: { [Op.like]: `%${filter}%` } }
        ]
      }
    }
    // Realizar la consulta con paginación y filtros
    const data = await DishType.findAndCountAll(filterCondition)
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
    const data = await DishType.findAll()
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
  getAll, 
  filterAndPaginate,
  paginate
}