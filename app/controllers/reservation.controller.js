const sequelize = require('../database/config')
const Reservation = require('../models/reservation.model')
const { RESERVATION_STATUS, RESERVATION_TIME_TYPE } = require('../constants/db_constants')
const PackageDetail = require('../models/packageDetail.model')
const RoomTimeType = require('../models/roomTimeType.model')
const ReservationDetail = require('../models/reservationDetail.model')
const RoomTimeDetail = require('../models/roomTimeDetail.model')
const ReservationTimeDetail = require('../models/reservationTimeDetail.model')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    /* CREAMOS LOS DATOS DE LA RESERVACION */
    let reservation = {
      statusId: RESERVATION_STATUS.EN_ESPERA,
      userRoleId: req.user.data.UserRole.id,
      roomId: req.body.roomId,
      date: req.body.date,
      currentDate: req.body.currentDate,
      timeTypeId: req.body.timeTypeId
    }

    // AÑadimos LOS DATOS DEL PAQUETE
    if(req.body.packageId) {
      reservation.packageId = req.body.packageId
    }

    // Si es reservacion por dia
    if(req.body.timeTypeId === RESERVATION_TIME_TYPE.PER_DAY) {
      let found = await Reservation.findOne({
        where: {
          roomId: req.body.roomId,
          date: req.body.date
        }
      })
      if(found) {
        return res.json({
          error: true,
          msg: 'No es posible reservar esa fecha todo el dia, debido a que ya han sido reservadas varias horas o todo el día'
        })
      }
    } 
    // Si es reservacion por horas
    if(req.body.timeTypeId === RESERVATION_TIME_TYPE.PER_HOURS) {
      // VERIFICMOS QUE EL HORARIO ESTE DISPONIBLE
      let query = `CALL ValidateHours(
        '${req.body.roomId}', 
        '${req.body.date}', 
        '${req.body.initialTime}', 
        '${req.body.finalTime}'
      )`
      let canRegister = await sequelize.query(query)
      // Si está ocupado no regitramos nada y retornamos
      console.log(canRegister)
      if(canRegister[0].total !== 0) {
        transaction.rollback()
        return res.json({
          error: true,
          msg: 'El horario seleccionado ya esta ocupado'
        })
      }
    } 

    const created = await Reservation.create(reservation, {transaction})
    /* SI HUBO ERROR AL CREAR RESERVACION */ 
    if(!created) {
      await transaction.rollback() 
      return res.json({
        error: true,
        msg: 'Error al crear la reservación'
      })
    }
    // SI TODO SALIO BIEN GUARDAMOS EL DETALLE DEL TIEMPO DE RESERVA
    if(!await createReservationTimeDetail(req, created.id, transaction)){
      transaction.rollback()
      return res.json({error: true, msg: 'Error al añadir horarios de la reservacion'})
    }

    // PROCESAMOS LOS DATOS DEL PAQUETE
    if(req.body.packageId) {
      let details = await getPackageDetails(req.body.packageId, created.id)
      let inserted = await ReservationDetail.bulkCreate(details, {transaction})
      if(!inserted) {
        await transaction.rollback() 
        return res.json({
          error: true,
          msg: 'Error al guardar los datos del paquete de la reservacion'
        })
      }
    }
    // Si todo va bien guardamos los cambios
    await transaction.commit()
    return res.json({ done: true, msg: 'Se ha creado la reservación correctamente. En espera de ser aprobada' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos de la reservación' })
  }
}


async function createReservationTimeDetail(req, reservationId, transaction) {
  let roomDetail = await RoomTimeDetail.findOne({
    where: {
      roomId: req.body.roomId,
      timeType: req.body.timeTypeId 
    }
  })
  if(roomDetail) {
    let detail = {
      initialTime: req.body.initialTime,
      finalTime: req.body.finalTime,
      price: roomDetail.price,
      reservationId
    }
    return await ReservationTimeDetail.create(detail ,{transaction})
  } else {
    transaction.rollback()
  }
}

async function getPackageDetails(packageId, reservationId) {
  // Gbtenemos todos los registros que pertenezcan a ese paquete
  const itemsDetails = await PackageDetail.findAll({
    where: {
      packageId: packageId
    }
  })

  return itemsDetails.map((detail) => {
    delete detail.packageId
    detail.reservationId = reservationId
    return detail
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
    await Reservation.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Eliminamos la imagen anterior usando su path
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
    const { id } = req.body.found
    // si existe lo eliminamos
    const affectedRows = await Reservation.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar local'})
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
    return res.json({ error: true, msg: 'Error al intentar eliminar el local' })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    let query = `CALL GetReservationsByPagination(${offset}, ${perPage})`
    let rows = await sequelize.query(query)
    return res.json({ result: true, data: {count: rows.length, rows}})
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
    const rows = await sequelize.query(`CALL GetReservationsByFilterPagination(${perPage}, ${offset}, '${filter}')`)
    const count = await sequelize.query(`CALL CountReservationsByFilter('${filter}')`)
    return res.json({ result: true, data: {count, rows} }) 
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los locales' })
  }
}

async function getAll(req, res) {
  try {
    const rooms = await Reservation.findAll()
    return res.json({ data: rooms })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los locales' })
  }
}

async function getTypes(req, res) {
  try {
    const types = await RoomTimeType.findAll()
    return res.json({ data: types })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los locales' })
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  paginate, 
  getTypes,
  filterAndPaginate
}