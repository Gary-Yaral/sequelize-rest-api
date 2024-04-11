const sequelize = require('../database/config')
const Reservation = require('../models/reservation.model')
const { Op, literal } = require('sequelize')
const { RESERVATION_STATUS, RESERVATION_TIME_TYPE, ALL_DAY_TIMES } = require('../constants/db_constants')
const PackageDetail = require('../models/packageDetail.model')
const ScheduleType = require('../models/sheduleType.model')
const ReservationPackage = require('../models/reservationPackage.model')
const ReservationType = require('../models/reservationType.model')
const ReservationSchedule = require('../models/reservationSchedule.model')
const UserRoles = require('../models/userRoleModel')
const User = require('../models/userModel')
const Room = require('../models/room.model')

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
      scheduleTypeId: req.body.scheduleTypeId
    }

    // AÑadimos LOS DATOS DEL PAQUETE
    if(req.body.packageId) {
      reservation.packageId = req.body.packageId
    }

    let { roomId, date, initialTime, finalTime} = req.body
    // Consultamos los horarios de esa fecha
    let reservedSchedules = await getReservedHours(roomId, date, initialTime, finalTime)
    // Si hay error retornamos inmediatamente
    if(reservedSchedules.error) { 
      await transaction.rollback()
      return res.json(reservedSchedules)}
    // Si es reservacion por dia
    if(reservedSchedules.hours.length > 0) {
      await transaction.rollback()
      return res.json({
        error: true,
        msg: 'No es posible reservar esa fecha </br></br><b>Razones</b></br>' + reservedSchedules.str
      })
    } 
    // Creamos la reservación
    const created = await Reservation.create(reservation, {transaction})
    if(!created) {
      await transaction.rollback() 
      return res.json({ error: true, msg: 'Error al crear la reservación' })
    }
    // Guardamos el horario con sus datos
    let saveScheduleResult = await addReservationSchedule(req, created.id, transaction)
    if(saveScheduleResult.error){
      transaction.rollback()
      return res.json(saveScheduleResult)
    }
    // Guardamos los datos del paquete
    if(req.body.packageId) {
      let packageDetailResult = await addReservationPackage(req, created.id, transaction)
      if(packageDetailResult.error) { 
        await transaction.rollback()
        return res.json(packageDetailResult)}
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

async function addReservationPackage(req, reservationId, transaction) {
  try {
    let details = await getPackageDetails(req.body.packageId, reservationId)
    if(details.length === 0) { return {error: true, msg: 'No hay items'}}
    return await ReservationPackage.bulkCreate(details, {transaction})
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al crear los detalles del paquete que incluirá la reservación'}
  }
}

async function getReservedHours(roomId, date, initialTime, finalTime) {
  try {   
    const reservedHours = await Reservation.findAll({
      include: [ReservationSchedule],
      where: {
        [Op.and]: [
          { roomId },
          { date }, 
          {
            [Op.or]: [
              {
                '$ReservationSchedules.initialTime$': {
                  [Op.lte]: initialTime,
                },
                '$ReservationSchedules.finalTime$': {
                  [Op.gte]: initialTime,
                },
              },
              {
                '$ReservationSchedules.initialTime$': {
                  [Op.lte]: finalTime,
                },
                '$ReservationSchedules.finalTime$': {
                  [Op.gte]: finalTime,
                },
              },
              {
                '$ReservationSchedules.initialTime$': {
                  [Op.gte]: initialTime,
                },
                '$ReservationSchedules.finalTime$': {
                  [Op.lte]: finalTime,
                },
              }
            ]
          },
        ],
      }
    })
    let str = ''
    reservedHours.forEach((schedule, i) => {
      let selectedSchedule = schedule.dataValues.ReservationSchedules[0]
      if(i !== 0) {
        str += '</br>'
      }
      if(selectedSchedule.initialTime === ALL_DAY_TIMES.INITIAL && selectedSchedule.finalTime === ALL_DAY_TIMES.FINAL) {
        str += '- Se reservó todo el día'
      } else {
        str += '- Se reservó de ' + selectedSchedule.initialTime +' a '+ selectedSchedule.finalTime
      }
    })
    return { hours: reservedHours , str }
  } catch (error) {
    console.log(error)
    return { error: true, msg: 'Error al consultar horarios reservados'}
  }
}

async function findRoomDetail(req) {
  try {
    return await ReservationType.findOne({
      where: {
        roomId: req.body.roomId,
        timeType: req.body.scheduleTypeId 
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function addReservationSchedule(req, reservationId, transaction) {
  try {
    let roomDetail = await findRoomDetail(req) 
    if(roomDetail) {
      let detail = {
        initialTime: req.body.initialTime,
        finalTime: req.body.finalTime,
        price: roomDetail.price,
        reservationId
      }
      return await ReservationSchedule.create(detail ,{transaction})
    } else {
      return { error: true, msg: 'No existe el local seleccionado'}
    }
  } catch (error) {
    console.log(error)
    return { error: true, msg: 'Error al agregar los datos del horario de la reservación'}
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
    let reservedSchedules = await getReservedHours(roomId, date, initialTime, finalTime)
    let updateReservationResult = await updateReservation(req, transaction)
    // SI hubo error al actualizar la reservación
    if(updateReservationResult.error) {
      await transaction.rollback()
      return res.json(updateReservationResult)
    }

    /* ACTUALIZAMOS SEGUN EL TIPO DE RESERVACIÓN */
    // Definimos un mensaje de error en caso de que no se pueda reservar
    let errorResponse = { error: true, msg: ''}    
    // Definimos un mensaje de error en caso de que no se pueda reservar
    if(req.body.scheduleTypeId === RESERVATION_TIME_TYPE.PER_HOURS) {
      errorResponse.msg = 'No es posible reservar esa hora </br></br><b>Razones</b></br>' + reservedSchedules.str
    }

    if(req.body.scheduleTypeId === RESERVATION_TIME_TYPE.PER_DAY) {
      errorResponse.msg = 'No es posible reservar ese <b>día</b></br></br><b>Razones</b></br>' + reservedSchedules.str
    }
    // Si hay de una no se podrá actualizar
    if(reservedSchedules.hours.length > 1) {
      await transaction.rollback()
      return res.json(errorResponse)
    }
    // Si hay solo uno validamos si se trata de una reservación dieferente
    if(reservedSchedules.hours.length === 1) {
      if(reservedSchedules.hours[0].id !== parseInt(req.params.id)){
        await transaction.rollback()
        return res.json(errorResponse)
      }
    }
    // Si se trata de un horario diferente actualizamos
    if(!await isSameSchedule(req, reservedSchedules)) {
      // Actualizamos el horario de reservación
      let updateScheduleResult = await updateSchedule(req, transaction)
      if(updateScheduleResult.error) {
        await transaction.rollback()
        return res.json(updateScheduleResult) 
      }
    }
    // Hay que procesar la información del paquete que envió
    let processPackageResult = await processReservationPackage(req,  transaction)
    if(processPackageResult.error) {
      await transaction.rollback()
      return res.json(processPackageResult)
    }
    // Si todo salió guardamos los cambios
    await transaction.commit()
    return res.json({done: true, msg: 'Reservación se ha actualizado correctamente'})   
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar datos del local' })
  }
}

async function isSameSchedule(req, reservedSchedules) {
  let schedule = reservedSchedules.hours[0].ReservationSchedules[0] 
  let isSameInitialStart = schedule.initialTime === req.body.initialTime
  let isSameFinalTime = schedule.finalTime = req.body.finalTime
  return isSameInitialStart && isSameFinalTime
}

async function processReservationPackage(req,  transaction) {
  try {
    // Si tenia pero ahora se quitó
    if(!req.body.packageId && req.body.found.packageId) {
      return await removeReservationPackage(req.params.id, transaction)
    }
    // No tenia pero ahora se agregó
    if(req.body.packageId && !req.body.found.packageId) {
      return await addReservationPackage(req, req.params.id, transaction)
    }
    // Si tenia pero se va actualizar
    let isNotSamePackage = (parseInt(req.body.packageId) !== parseInt(req.body.found.packageId))
    if((req.body.packageId && req.body.found.packageId) && isNotSamePackage) {
      let removePackageResult = await removeReservationPackage(req.params.id, transaction)
      if(removePackageResult.error) { return removePackageResult }
      return await addReservationPackage(req, req.params.id, transaction)
    }
    return {done: true, msg: 'No se realiza ningun cambio'}
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al procesar la información del paquete'}
  }
}

async function removeReservationPackage(reservationId, transaction) {
  try {
    return await ReservationPackage.destroy({where: {reservationId}, transaction})
    
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error el remover todos los items del paquete actual'}
  }
}

async function updateReservation(req, transaction) {
  try {
    let { body: {date, roomId, scheduleTypeId, packageId}, params: { id }} = req
    // Verificamos si envio o no packete para enviarlo como null en caso de no enviar
    if(!packageId  || packageId === '') {
      packageId = null
    }
    // Creamos objeto con los nuevos datos
    let data = {date, roomId, scheduleTypeId, packageId}
    // Actualizamos la reservación
    return await Reservation.update(data, {where: { id }}, {transaction})
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al actualizar la reservación'}
  }

}

async function updateSchedule(req, transaction) {
  try {
    let { body: {roomId, initialTime, finalTime, scheduleTypeId}, params: { id }} = req
    let reservationType = await ReservationType.findOne({
      where: { roomId, scheduleTypeId }
    })

    if(reservationType) {
      let { price } = reservationType
      let data = { initialTime, finalTime, price}
      return await ReservationSchedule.update(data,{where: {reservationId: id}},{transaction})
    } else {
      return {error: true, msg: 'Error: No existe ese tipo de reservación'}
    }
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al actualizar el horario de la reservación'}
    
  }

}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const { id, statusId } = req.body.found
    // Si está aprobada no permitiremos que elimine
    if (statusId === RESERVATION_STATUS.APROBADA) {
      return res.json({
        done: true,
        msg: 'No es posible eliminar esta reservacion porque está aprobada y tiene un pago pendiente'
      })
    }
    await Reservation.destroy({ where: { id }, transaction})
    // Si todo ha ido bien guardamos los cambios
    await transaction.commit()
    return res.json({
      done: true,
      msg: 'Reservación ha sido eliminada correctamente',
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
    const reservations = await Reservation.findAndCountAll({
      attributes: [
        'id',
        'currentDate',
        'date',
        'packageId',
        'userRoleId',
        'roomId',
        'statusId',
        'scheduleTypeId',
        [
          literal(`CASE 
            WHEN Reservation.packageId IS NULL THEN 'NO'
            ELSE 'SI'
          END`),
          'hasPackage'
        ]
      ],
      include: [ 
        {
          model: ReservationSchedule,
          attributes: [
            'initialTime',
            'finalTime',
            [
              literal(`CASE 
                WHEN Reservation.scheduleTypeId = 1 THEN
                  ReservationSchedules.price * (
                    TIME_TO_SEC(TIMEDIFF(
                      ReservationSchedules.finalTime, ReservationSchedules.initialTime
                    )) / 3600)
                ELSE ReservationSchedules.price
              END`),
              'totalPerSchedule'
            ]      
          ]
        }, 
        {
          model: UserRoles,
          include:[ 
            {
              model: User,
              attributes: ['name', 'lastname', 'dni']
            }
          ]
        },
        ScheduleType,
        Room
      ],
      group: ['Reservation.id'],
      raw: true,
      limit: perPage,
      offset
    })
    let { rows, count:{length} } = reservations
    return res.json({ result: true, data: {rows, count: length}})
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
    const reservations = await Reservation.findAndCountAll({
      include: [ReservationSchedule, ScheduleType],
      raw: true,
      limit: perPage,
      offset,
      where: {
        [Op.or]:{
          date: {[Op.like]: `%${filter}%`}
        }
      }
    })
    return res.json({ result: true, data: reservations }) 
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
    const types = await ScheduleType.findAll()
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