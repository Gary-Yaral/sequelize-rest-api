const sequelize = require('../database/config')
const Payment = require('../models/payment.model')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    //
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos de la reservación' })
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    //salió guardamos los cambios
    //await transaction.commit()
    return res.json({done: true, msg: 'Reservación se ha actualizado correctamente'})   
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar datos del local' })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({ done: true, msg: 'Reservación ha sido eliminada correctamente' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al intentar eliminar la reservación' })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    
    return res.json({ result: true, /* data: {count, rows} */ })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al paginar las reservaciones' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const offset = (currentPage - 1) * perPage
    // Realizar la consulta con paginación y filtros
    // const count = (await sequelize.query(createPaginateFilterQuery(filter), {type: QueryTypes.SELECT})).length
    //const rows = await sequelize.query(createPaginateFilterQuery(filter, true, {limit: perPage, offset}), {type: QueryTypes.SELECT})
    
    return res.json({ result: true, /* data: {count, rows} */}) 
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los locales' })
  }
}

async function getAll(req, res) {
  try {
    const rooms = await Payment.findAll()
    return res.json({ data: rooms })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los pagos' })
  }
}

async function findOne(req, res) {
  try {
    let id = req.params.id
    const payment = await Payment.findOne({where: {id}})
    return res.json({data: payment})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al consultar pago'})
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  findOne,
  paginate, 
  filterAndPaginate
}