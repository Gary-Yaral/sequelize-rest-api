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

    let { roomId, date, initialTime, finalTime} = req.body
    // Si es reservacion por dia
    if(req.body.timeTypeId === RESERVATION_TIME_TYPE.PER_DAY) {
      let found = await Reservation.findOne({
        where: {
          roomId: req.body.roomId,
          date: req.body.date
        }
      })
      if(found) {
        transaction.rollback()
        let selected = await getReservedHours(roomId, date, initialTime, finalTime)
        return res.json({
          error: true,
          msg: 'No es posible reservar esa fecha </br></br><b>Razones</b></br>' + selected.str
        })
      }
    } 
    // Si es reservacion por horas
    if(req.body.timeTypeId === RESERVATION_TIME_TYPE.PER_HOURS) {
      // VERIFICMOS QUE EL HORARIO ESTE DISPONIBLE
      let query = `CALL ValidateHours(
        '${roomId}', 
        '${date}', 
        '${initialTime}', 
        '${finalTime}'
      )`
      let canRegister = await sequelize.query(query)
      // Si está ocupado no regitramos nada y retornamos
      if(canRegister[0].total !== 0) {
        transaction.rollback()
        let selected = await getReservedHours(roomId, date, initialTime, finalTime)
        return res.json({
          error: true,
          msg: 'No es posible reservar esa fecha </br></br><b>Razones</b></br>' + selected.str
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
      if(details.length === 0) { return res.json({error: true, msg: 'No hay items'})}
      let inserted = await ReservationDetail.bulkCreate(details, {transaction})
      if(!inserted) {
        await transaction.rollback() 
        return res.json({
          error: true,
          msg: 'Error al guardar los datos del paquete de la reservacion'
        })
      }
    }
    // SI TODO VA BIEN GUARDAMOS LOS CAMBIOS
    await transaction.commit()
    return res.json({ done: true, msg: 'Se ha creado la reservación correctamente. En espera de ser aprobada' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos de la reservación' })
  }
}

async function getReservedHours(roomId, date, initialTime, finalTime) {
  let times = await sequelize.query(`CALL GetHOurs('${roomId}','${date}','${initialTime}','${finalTime}')`)
  let str = ''
  times.forEach((time, i) => {
    if(i !== 0) {
      str += '</br>'+ time.selected
    } else {
      str += time.selected
    }
  })
  return {
    found: times,
    str
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
    delete detail.dataValues.packageId
    detail.dataValues.reservationId = reservationId
    return detail.dataValues
  })
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    let { roomId, date,  initialTime, finalTime} = req.body
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    // Si es reservacion por dia
    let selected = await getReservedHours(roomId, date, initialTime, finalTime)
    console.log(selected)
    if(req.body.timeTypeId === RESERVATION_TIME_TYPE.PER_DAY) {
      if(selected.found.length === 1) {
        console.log(selected.found[0].reservationId)
        if(selected.found[0].reservationId === parseInt(req.params.id)){
          console.log('Puedo actulizar')
        } else {
          console.log('no se puede')
        }
      } else {
        console.log('hay mas de uno y no se puede')
      }
    }
    console.log(selected)
    /* // Actualizamos los datos
    await Reservation.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Eliminamos la imagen anterior usando su path
    // Retornamos el mensaje de que todo ha ido bien
    await transaction.commit() */ 
    return res.json({
      error: true,
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
    // EXTRAEMOS TANTO EL ID COMO EL ESTADO DEL REGISTROS ENCONTRADO
    const { id, statusId } = req.body.found
    // SI SU ESTADO ESTÁ EN APROBADA NO SE PUEDE ELIMINAR A MENOS QUE SE CAMBIE DE ESTADO A PENDIENTE
    if (statusId === RESERVATION_STATUS.APROBADA) {
      return res.json({
        done: true,
        msg: 'No es posible eliminar esta reservacion porque está aprobada y tiene un pago pendiente'
      })
    }
    // ELIMINIAMOS LA RESERVACION
    await Reservation.destroy({ where: { id }, transaction})
    // GUARDAMOS LOS CAMBIOS
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Reservación ha sido eliminada correctamente',
      data: {id, statusId}
    })
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