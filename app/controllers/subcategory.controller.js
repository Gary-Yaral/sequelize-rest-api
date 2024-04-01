const sequelize = require('../database/config')
const Category = require('../models/category.model')
const Subcategory = require('../models/subcategory.model')
const { Op } = require('sequelize')

async function getAll(req, res) {
  try {
    const subcategories = await Subcategory.findAll()
    return res.json({data: subcategories})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al cargar las subcategorías'})
  }
}

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const data = {
      name: req.body.name.toUpperCase(),
      categoryId: req.body.categoryId
    }
    await Subcategory.create(data, {transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Subcategoría ha sido creada satisfactoriamente'})
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({error: true, msg: 'Error al guardar la subcategoría'})
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const data = {
      name: req.body.name.toUpperCase(),
      categoryId: req.body.categoryId
    }
    await Subcategory.update(data, {where: {id: req.params.id}}, {transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Subcategoría ha sido actualizada satisfactoriamente'})
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({error: true, msg: 'Error al actualizar la subcategoría'})
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    await Subcategory.destroy({where: {id: req.params.id}, transaction})
    transaction.commit()
    return res.json({done: true, msg: 'Subcategoría ha sido actualizada satisfactoriamente'})
  } catch (error) {
    console.log(error)
    transaction.rollback()
    return res.json({error: true, msg: 'Error al actualizar la subcategoría'})
  }
}

async function find(req, res) {
  try {
    const found = await Subcategory.findOne({where: {id: req.params.id}})
    return res.json({data: found})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al buscar subcategoría'})
  }
}

async function findByCategory(req, res) {
  try {
    const found = await Subcategory.findAll({
      include: [Category],
      where: {
        categoryId: req.params.id
      }
    })
    return res.json({data: found})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al buscar subcategoría'})
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    const found = await Subcategory.findAndCountAll({
      include: [Category],
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
    const found = await Subcategory.findAndCountAll({
      include: [Category],
      offset,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${filter}%` } },
          { '$Category.name$': { [Op.like]: `%${filter}%`} }
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
  findByCategory,
  find,
  getAll
}