const Category = require('../models/category.model')
async function getAll(req, res) {
  try {
    const categories = await Category.findAll()
    return res.json({data: categories})
  } catch (error) {
    return res.json({error: true, msg: 'Error al cargar las categorías'})
  }
}

module.exports = {
  getAll
}