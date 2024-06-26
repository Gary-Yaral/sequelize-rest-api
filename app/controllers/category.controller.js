const { Op } = require('sequelize')
const sequelize = require('../database/config')
const Category = require('../models/category.model')
const { parentReferenceError } = require('../utils/functions')

async function getAll(req, res) {
  try {
    const categories = await Category.findAll()
    return res.json({data: categories})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al cargar las categorías'})
  }
}

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const data = {
      name: req.body.name.toUpperCase(),
      categoryId: req.body.categoryId
    }
    await Category.create(data, {transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Categoría ha sido creada satisfactoriamente'})
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({error: true, msg: 'Error al guardar la Categoría'})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const data = {
      name: req.body.name.toUpperCase(),
    }
    await Category.update(data, {where: {id: req.params.id}}, {transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Categoría ha sido actualizada satisfactoriamente'})
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({error: true, msg: 'Error al actualizar la Categoría'})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Category.destroy({where: {id: req.params.id}, transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Categoría ha sido actualizada satisfactoriamente'})
  } catch (error) {
    transaction.rollback()
    const validation =  parentReferenceError(error)
    if(validation.parent) {
      return res.json({error: true, msg: validation.msg})
    }
    console.log(error)
    return res.json({error: true, msg: 'Error al actualizar la Categoría'})
  }
}

async function find(req, res) {
  try {
    const found = await Category.findOne({where: {id: req.params.id}})
    return res.json({data: found})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al buscar Categoría'})
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    const found = await Category.findAndCountAll({
      offset,
      limit: perPage,
      raw: true
    })
    return res.json({
      result: true,
      data: found
    })
  } catch (error) {
    console.log(error)
    return res.json({ error:true, msg: 'Error al paginar las subcategorias' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const offset = (currentPage - 1) * perPage
    const found = await Category.findAndCountAll({
      offset,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } }
        ]
      },
      limit: perPage,
      raw: true
    })
    return res.json({
      result: true,
      data: found
    })
  } catch (error) {
    console.log(error)
    return res.json({ error:true, msg: 'Error al paginar las subcategorias' })
  }
}

module.exports = {
  add,
  update,
  paginate,
  filterAndPaginate,
  remove,
  find,
  getAll
}