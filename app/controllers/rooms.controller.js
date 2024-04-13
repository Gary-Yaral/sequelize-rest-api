const sequelize = require('../database/config')
const { QueryTypes} = require('sequelize')
const Room = require('../models/room.model')
const { deteleImage } = require('../utils/deleteFile')
const { RESERVATION_TIME_TYPE, ERROR_PARENT_CODE } = require('../constants/db_constants')
const ReservationType = require('../models/reservationType.model')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const created = await Room.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios en la base de datos
    if(!created) {
      await transaction.rollback() 
      const hasError = deteleImage(req.body.image) 
      if(hasError) {
        return res.json({ error: true, msg: 'Error al eliminar imagen guardada previamente' })
      }
      return res.json({
        error: true,
        msg: 'Error al intentar agregar local'
      })
    }
    // Creamos la data para los tipo de reservacion del local
    const types = [
      {roomId: created.id, scheduleTypeId: RESERVATION_TIME_TYPE.PER_HOURS, price: req.body.perHour},
      {roomId: created.id, scheduleTypeId: RESERVATION_TIME_TYPE.PER_DAY, price: req.body.perDay},
    ]
    // Guardamos los tipos de reservación que tendrá
    await ReservationType.bulkCreate(types, {transaction})
    await transaction.commit()
    return res.json({ done: true, msg: 'Local ha sido agregado correctamente' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos del local' })
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    if(req.body.image === '' || !req.body.image) {
      delete req.body.image
    }
    // Actualizamos los datos
    await Room.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Eliminamos la imagen anterior usando su path
    if(req.body.image) {
      const hasError = deteleImage(req.body.found.image)  
      // Si no se pudo eliminar la imagen que guardamos devolvemos error
      if(hasError) {
        console.log(hasError)
        await transaction.rollback()
        return res.json({ error: true, msg: 'Error al eliminar imagenes anteriores' })
      }
    }
    // Creamos la data para los tipo de reservacion del local
    await ReservationType.update(
      {
        price: req.body.perHour
      }, 
      {
        where: { 
          roomId: req.params.id, 
          scheduleTypeId: RESERVATION_TIME_TYPE.PER_HOURS
        }
      }, {transaction}
    )
    await ReservationType.update(
      {
        price: req.body.perDay
      }, 
      {
        where: { 
          roomId: req.params.id, 
          scheduleTypeId: RESERVATION_TIME_TYPE.PER_DAY
        }
      }, {transaction}
    )
    // Retornamos el mensaje de que todo ha ido bien
    await transaction.commit() 
    return res.json({
      done: true,
      msg: 'Registro actualizado correctamente'
    })
    
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar datos del local' })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    //Extraemos el id de registro encontrado
    const { id, image } = req.body.found
    // si existe lo eliminamos
    const affectedRows = await Room.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar local'})
    }
    // Si todo ha ido bien
    const hasError = deteleImage(image)
    if(hasError) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar las imagenes del local' })
    }
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
    return res.json({
      done: true,
      msg: 'Local eliminado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    if(error.original) {
      if(error.original.errno === ERROR_PARENT_CODE) {
        return res.json({ error: true, msg: 'No es posible eliminar este local, tiene registros vinculados' })
      }
    }
    console.log(error)
    return res.json({ error: true, msg: 'Error al intentar eliminar el local' })
  }
}

function getPaginationQuery(paginate = false, pagination = {}) {
  let query = `
  SELECT
    room.*,
    MAX(CASE WHEN reservation_type.scheduleTypeId = 1 THEN reservation_type.price END) AS perHour,
    MAX(CASE WHEN reservation_type.scheduleTypeId = 2 THEN reservation_type.price END) AS perDay
    FROM room
    INNER JOIN reservation_type 
    ON room.id = reservation_type.roomId
    GROUP BY room.id
  `
  if(paginate && Object.keys(pagination).length > 0) {
    query +=` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
  } 

  return query
}

function getPaginationFilterQuery(filter, paginate, pagination = {} ) {
  const allRoomsQuery = getPaginationQuery()
  let query = `
  SELECT * FROM (${allRoomsQuery}) AS subquery
      WHERE
      LOWER(subquery.name) LIKE LOWER(CONCAT('%', '${filter}', '%')) Or
      LOWER(subquery.email) LIKE LOWER(CONCAT('%', '${filter}', '%')) Or
      LOWER(subquery.telephone) LIKE LOWER(CONCAT('%', '${filter}', '%')) Or
      LOWER(subquery.address) LIKE LOWER(CONCAT('%', '${filter}', '%')) Or
      CAST(subquery.capacity AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.m2 AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.perDay AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.perHour AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.minTimeRent AS CHAR) LIKE CONCAT('%', '${filter}', '%')
  `
  if(paginate && Object.keys(pagination).length > 0) {
    query +=` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
  } 

  return query
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    const count = (await sequelize.query(getPaginationQuery(), {type: QueryTypes.SELECT})).length
    const rows = await sequelize.query(getPaginationQuery(true, { limit: perPage, offset}), {type: QueryTypes.SELECT})
    return res.json({ result: true, data: {count, rows} })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al paginar los locales' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const offset = (currentPage - 1) * perPage
    const count = (await sequelize.query(getPaginationFilterQuery(), {type: QueryTypes.SELECT})).length
    const rows = await sequelize.query(getPaginationFilterQuery(filter, true, { limit: perPage, offset}), {type: QueryTypes.SELECT})
    return res.json({ result: true, data: {count, rows} })
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los locales' })
  }
}

async function getAll(req, res) {
  try {
    const rooms = await Room.findAll()
    return res.json({ data: rooms })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al listar todos los locales' })
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  paginate, 
  filterAndPaginate
}