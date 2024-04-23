const sequelize = require('../database/config')
const Reservation = require('../models/reservation.model')
const { Op, QueryTypes } = require('sequelize')
const { RESERVATION_STATUS, RESERVATION_TIME_TYPE, ALL_DAY_TIMES, PAYMENT_STATUS, DEFAULT_PAYMENT_IMAGE, DEFAULT_PAYMENT_IMAGE_PUBLIC_ID, PROCESS_VOUCHER_ROUTE_FULL } = require('../constants/db_constants')
const PackageDetail = require('../models/packageDetail.model')
const ScheduleType = require('../models/sheduleType.model')
const ReservationPackage = require('../models/reservationPackage.model')
const ReservationType = require('../models/reservationType.model')
const ReservationSchedule = require('../models/reservationSchedule.model')
const Item = require('../models/item.model')
const ReservationStatus = require('../models/reservationStatus.model')
const { sendMail } = require('../email/mailer')
const { htmlInitial } = require('../email/types/created')
const Room = require('../models/room.model')
const UserRoles = require('../models/userRoleModel')
const User = require('../models/userModel')
const { htmlSuccess } = require('../email/types/success')
const { htmlDenied } = require('../email/types/denied')
const Payment = require('../models/payment.model')
const { getEndPointRoute } = require('../utils/server')

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
    // Enviamos el email
    let msgResult = await sendNewEmail(req, RESERVATION_STATUS.EN_ESPERA)
    if(msgResult.error) {
      await transaction.rollback()
      return res.json(msgResult)
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

async function sendNewEmail(req, type) {
  try {
    let { roomId, initialTime, finalTime, date } = req.body
    let msgData = await createMsgData(req, type, roomId, initialTime, finalTime, date)
    if(msgData.error) { return msgData }
    let emailUser = await getUserEmail(req, type)
    if(emailUser.error) { return emailUser }
    return await sendMail({
      email: emailUser,
      subject: 'Proceso de Reservación',
      text: msgData.text,
      type: 'html'
    })

  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al enviar el mensaje'}
  }
}

async function createMsgData(req, type, roomId, initialTime, finalTime, date) {
  try {
    let text = ''
    const local = await Room.findOne({where: {id: roomId}})
    let str = `
      <p><b>Local: </b>${local.dataValues.name}</p>
      <p><b>Horario: </b>${initialTime} a ${finalTime}</p>
      <p><b>Fecha: </b>${date}</p>
    `
    if(type === RESERVATION_STATUS.EN_ESPERA) {
      return {text: htmlInitial(str)}
    }
  
    if(type === RESERVATION_STATUS.APROBADA) {
      const accounts = [
        {bank: 'Banco Pichincha', account: '22032566433', type: 'Corriente'}
      ]
      const endpoint = getEndPointRoute(req, PROCESS_VOUCHER_ROUTE_FULL + req.params.id)
      return {text: htmlSuccess(str, accounts, endpoint)}
    }
    if(type === RESERVATION_STATUS.RECHAZADA) {
      return {text: htmlDenied(str)}
    }

    return { text }
  } catch (error) {
    console.log(error)
    return { error: true, msg: 'Error al crear el mensaje del email'}  
  }
}

async function getUserEmail(req, type) {
  try {
    if(type === RESERVATION_STATUS.EN_ESPERA) {
      let userId = req.user.data.User.id
      let found =  await User.findOne({where: {id: userId}})
      if (!found) { return {error: true, msg: 'Error al consultar email del usuario logueado'}}
      return found.dataValues.email
    }

    if(req.params.id && type !== RESERVATION_STATUS.EN_ESPERA) {
      const reservation = await Reservation.findOne({
        where: { id: req.params.id },
        include: [{model: UserRoles, include: [User]}]
      })
      return reservation.UserRole.User.email 
    }
    return {error: true, msg: 'Error al obtener email. No se ha enviado el id de la reservación'}
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al obtener el email del dueño de la reservación'}
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
        scheduleTypeId: req.body.scheduleTypeId 
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
  const itemsDetails = await PackageDetail.findAll({where: { packageId }})
  return itemsDetails.map((detail) => {
    delete detail.dataValues.id
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
    let errorResponse = { error: true, msg: ''}    
    if(req.body.scheduleTypeId === RESERVATION_TIME_TYPE.PER_HOURS) {
      errorResponse.msg = 'No es posible reservar esa hora </br></br><b>Razones</b></br>' + reservedSchedules.str
    }
    if(req.body.scheduleTypeId === RESERVATION_TIME_TYPE.PER_DAY) {
      errorResponse.msg = 'No es posible reservar ese <b>día</b></br></br><b>Razones</b></br>' + reservedSchedules.str
    }
    // Si hay más de un horario reservado no se podrá actualizar
    if(reservedSchedules.hours.length > 1) {
      await transaction.rollback()
      return res.json(errorResponse)
    }
    // Si hay solo un horario validamos si se trata de una reservación diferente
    if(reservedSchedules.hours.length === 1) {
      if(reservedSchedules.hours[0].id !== parseInt(req.params.id)){
        await transaction.rollback()
        return res.json(errorResponse)
      }
    }
    // Si se trata de la misma reservación pero un horario diferente actualizamos
    if(!await isSameSchedule(req, reservedSchedules)) {
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
    // Si tenia pero se va actualizar con uno diferente
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
    if(!packageId  || packageId === '') { packageId = null }
    let newData = {date, roomId, scheduleTypeId, packageId}
    return await Reservation.update(newData, {where: { id }}, {transaction})
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
    }
    return {error: true, msg: 'Error: No existe ese tipo de reservación'}
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
    return res.json({ done: true, msg: 'Reservación ha sido eliminada correctamente' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al intentar eliminar la reservación' })
  }
}

async function hasSameStatus(req) {
  try {
    const reservation = await Reservation.findOne({where: {id: req.params.id}})
    if(reservation) { 
      return {
        isSame: reservation.statusId === req.body.statusId, 
        statusId: reservation.statusId
      }
    }
    return {error: true, msg: 'Error no existe la reservación que intenta cargar'}
  } catch (error) {
    return {error: true, msg: 'Error al desconocido al consultar el estado de la reservación'}
  }
}

async function addRequestPropsForUpdateStatus(req) {
  try {
    const reservation = await Reservation.findOne({where: {id: req.params.id}, include: [ReservationSchedule]})
    let newProps = {
      date: reservation.date,
      roomId: reservation.roomId,
      initialTime: reservation.ReservationSchedules[0].initialTime,
      finalTime: reservation.ReservationSchedules[0].finalTime
    }
    req.body = { ...req.body, ...newProps}
    return {done: true, msg: 'Propiedades han sido agregadas'}
  } catch (error) {
    return {error: true, msg: 'Error al añadir en la request las propiedades necesarias para envio del mensaje'}
  }
}

async function updateReservationStatus(req, res) {
  const transaction = await sequelize.transaction() 
  try {
    let { statusId } = req.body
    let { id } = req.params
    let sameStatus = await hasSameStatus(req)
    if(sameStatus.error) { return res.json(sameStatus.error)}
    if(sameStatus.isSame) {
      return res.json({
        done: true, 
        msg: 'El estado de la reservación ha sido actualizado correctamente. No se envió enviado email porque el estado anterior era el mismo'
      })
    }
    const hasPayment = await hasApprovedPayment(id)
    if(hasPayment.error) {
      await transaction.rollback()
      return res.json(hasPayment)
    }
    let updatedReservation = await Reservation.update({ statusId }, { where: {id}, transaction })
    if(!updatedReservation) {
      await transaction.rollback()
      return res.json({error: true, msg: 'No se pudo actualizar el estado de la reservación'})
    }
    const processedPayment = await processPayment(req, transaction)
    if(processedPayment.error) {
      await transaction.rollback()
      return res.json(processedPayment)
    }
    const addRequestPropsResult = await addRequestPropsForUpdateStatus(req)
    if(addRequestPropsResult.error) {
      await transaction.rollback()
      return res.json(addRequestPropsResult)
    }
    const sendEmailResult = await sendNewEmail(req, statusId)
    if(sendEmailResult.error) {
      await transaction.rollback()
      return res.json(sendEmailResult)
    }
    await transaction.commit()
    return res.json({done: true, msg: 'Se ha actualizado el estado de la reservación. Se ha enviado un correo a <b>' + sendEmailResult.email + '</b>'})
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    return res.json({error: true, msg: 'Error al actualizar el estado de la reservación'})
  }
}

async function hasApprovedPayment(reservationId) {
  try {
    const foundPayment = await Payment.findOne({
      where: {
        reservationId, 
        paymentStatusId: PAYMENT_STATUS.APROBADA
      }})
    if(foundPayment) {
      return {error: true, msg: 'Esta reservación ya tiene un pago revisado y aprobado'}
    }
    return {done: true}
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al consultar el pago aprobado de la reservación seleccionada'}
  }

}

async function processPayment(req, transaction) {
  try {
    const foundPayment = await Payment.findOne({where: {reservationId: req.params.id, }})
    // Estaba en espera y la aprobaron
    if(req.body.statusId === RESERVATION_STATUS.EN_ESPERA || req.body.statusId === RESERVATION_STATUS.RECHAZADA) {
      if(foundPayment) {
        await deletePayment(req.params.id)
        // Eliminar la imagen del pago tambien
      }
      return {done: true}
    }
    let date = new Date()
    await Payment.create({
      date: date.toISOString().split('T')[0], 
      reservationId: req.params.id, 
      paymentStatusId: PAYMENT_STATUS.POR_REVISAR,
      total: req.body.payPerLocal + req.body.payPerPackage,
      image: DEFAULT_PAYMENT_IMAGE,
      publicId: DEFAULT_PAYMENT_IMAGE_PUBLIC_ID
    }, {transaction})
    return {done: true}
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al validar proceso de actualización de pago'}
  }
}

async function deletePayment(reservationId) {
  try {
    return await Payment.destroy({where: {reservationId}})
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al eliminar el pago registrado'}
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const offset = (currentPage - 1) * perPage
    let count = (await sequelize.query(createPaginateQuery(), {type: QueryTypes.SELECT})).length
    let rows = await sequelize.query(createPaginateQuery(true, {limit: perPage, offset}), {type: QueryTypes.SELECT})
    return res.json({ result: true, data: {count, rows} })
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
    const count = (await sequelize.query(createPaginateFilterQuery(filter), {type: QueryTypes.SELECT})).length
    const rows = await sequelize.query(createPaginateFilterQuery(filter, true, {limit: perPage, offset}), {type: QueryTypes.SELECT})
    
    return res.json({ result: true, data: {count, rows}}) 
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los locales' })
  }
}

function createPaginateQuery(paginate = false, pagination = {}) {
  let query =  getReservationsQuery() 
  if(paginate && Object.keys(pagination).length > 0) {
    query +=` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
  } 

  return query
} 

function getReservationsQuery() {
  return  `SELECT 
		reservation.id,
		reservation.roomId,
		reservation.currentDate,
		reservation_schedule.initialTime,
		reservation_schedule.finalTime,
		reservation.date,
		reservation.scheduleTypeId,
		reservation.packageId,
		reservation.statusId,
		reservation_status.status,
		room.capacity,
		room.image,
		room.m2,
		room.name AS roomName,
		CONCAT(user.name, ' ', user.lastname) AS userName,
		user.dni,
		role.role,
		COALESCE(SUM(reservation_package.price * reservation_package.quantity), 0) AS payPerPackage,
		schedule_type.type,
		COALESCE(CONVERT(TRUNCATE(TIME_TO_SEC(TIMEDIFF(reservation_schedule.finalTime, reservation_schedule.initialTime)) / 3600, 2), DOUBLE), 0) AS hours,
		CASE 
			WHEN reservation.scheduleTypeId = 1 THEN 0
			ELSE 1
		END AS days,
		reservation_schedule.price,
		CASE 
		    WHEN reservation.scheduleTypeId = 1 THEN COALESCE((reservation_schedule.price * (TIME_TO_SEC(TIMEDIFF(reservation_schedule.finalTime, reservation_schedule.initialTime)) / 3600)), 0)
		    ELSE reservation_schedule.price
		END AS payPerLocal,
		CASE 
		    WHEN COALESCE(SUM(reservation_package.price * reservation_package.quantity), 0) = 0  THEN 'NO'
		    ELSE 'SI'
		END AS includePackage,
		package.name AS packageName
	    FROM 
		reservation
	    LEFT JOIN reservation_package 
		ON reservation.id = reservation_package.reservationId
	    LEFT JOIN room 
		ON reservation.roomId = room.id
	    LEFT JOIN reservation_status
		ON reservation.statusId = reservation_status.id
	    LEFT JOIN reservation_schedule 
		ON reservation.id = reservation_schedule.reservationId
	    LEFT JOIN reservation_type 
		ON reservation.scheduleTypeId = reservation_type.scheduleTypeId AND room.id = reservation.roomId
	    LEFT JOIN schedule_type 
		ON reservation.scheduleTypeId = schedule_type.id
	    LEFT JOIN user_roles 
		ON reservation.userRoleId = user_roles.id
	    LEFT JOIN user ON user_roles.userId = user.id
	    LEFT JOIN role 
		ON role.id = user_roles.roleId
	    LEFT JOIN package 
		ON reservation.packageId = package.id
	    GROUP BY 
		reservation.id`
}

function createPaginateFilterQuery(filter, paginate = false, pagination = {}) {
  const paginationQuery = createPaginateQuery()
  let query = `
    SELECT *
    FROM (${paginationQuery}) AS subquery
    WHERE 
      subquery.currentDate LIKE CONCAT('%','${filter}', '%') OR
      subquery.initialTime LIKE CONCAT('%', '${filter}', '%') OR
      subquery.finalTime LIKE CONCAT('%', '${filter}', '%') OR
      subquery.date LIKE CONCAT('%', '${filter}', '%') OR
      LOWER(subquery.status) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      CAST(subquery.capacity AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.m2 AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      subquery.dni LIKE CONCAT('%', '${filter}', '%') OR
      LOWER(subquery.userName) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      LOWER(subquery.role) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      LOWER(subquery.roomName) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      LOWER(subquery.payPerPackage) LIKE CONCAT('%', '${filter}', '%') OR
      LOWER(subquery.type) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      CAST(subquery.hours AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.days AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.price AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      CAST(subquery.payPerLocal AS CHAR) LIKE CONCAT('%', '${filter}', '%') OR
      LOWER(subquery.includePackage) LIKE LOWER(CONCAT('%', '${filter}', '%')) OR
      LOWER(subquery.packageName) LIKE LOWER(CONCAT('%', '${filter}', '%'))
      `
  if(paginate && Object.keys(pagination).length > 0) {
    query +=` LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
  } 

  return query
}

async function getAll(req, res) {
  try {
    const rooms = await Reservation.findAll()
    return res.json({ data: rooms })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los locales' })
  }
}

async function getScheduleTypes(req, res) {
  try {
    const types = await ScheduleType.findAll()
    return res.json({ data: types })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los tipo de horarios' })
  }
}

async function getStatusTypes(req, res) {
  try {
    const types = await ReservationStatus.findAll()
    return res.json({ data: types })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los estados de reservación' })
  }
}

async function getReservationPackageData(req, res) {
  try {
    const reservationPackageData = await ReservationPackage.findAll({
      where: {
        reservationId: req.body.reservationId
      },
      include: [Item]
    })
    return res.json({ data: reservationPackageData })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los datos del paquete' })
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  paginate, 
  getScheduleTypes,
  updateReservationStatus,
  getStatusTypes,
  getReservationPackageData,
  filterAndPaginate
}