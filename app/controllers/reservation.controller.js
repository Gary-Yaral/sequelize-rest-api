const sequelize = require('../database/config')
const { Op, where, col, cast, fn, literal} = require('sequelize')
const Reservation = require('../models/reservation.model')
const { RESERVATION_STATUS } = require('../constants/db_constants')
const ReservationStatus = require('../models/reservationStatus.model')
const PackageDetail = require('../models/packageDetail.model')
const UserRoles = require('../models/userRoleModel')
const User = require('../models/userModel')
const Room = require('../models/room.model')
const ReservationDetail = require('../models/reservationDetail.model')
Reservation
async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    /* AÑADIMOS LOS DATOS QUE NO VIENEN EN LA REQUEST */
    req.body.statusId = RESERVATION_STATUS.EN_ESPERA // Estados de espera será por defecto
    req.body.userRoleId = req.user.data.UserRole.id// Estados de espera será por defecto
    
    const created = await Reservation.create(req.body, {transaction})
    /* SI HUBO ERROR AL CREAR RESERVACION */ 
    if(!created) {
      await transaction.rollback() 
      return res.json({
        error: true,
        msg: 'Error al crear la reservación'
      })
    }
    if(req.body.packageId) {
      const details = await getPackageDetails(req.body.packageId)
      console.log(details)
      /* return res.json({ error: true, msg: details }) */
    }
    /* SI LA RESERVACION SE CREÓ */
    // Una vez eliminada la imagen deshacemos los cambios y devolvemos error
    await transaction.commit()
    return res.json({ done: true, msg: 'Se ha creado la reservación correctamente. En espera de ser aprobada' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos de la reservación' })
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
    let data = await Reservation.findAll({
      include: [
        ReservationStatus,
        Room,
        ReservationDetail,
        {
          model: UserRoles,
          include: [User]
        }
      ],
      limit: perPage,
      offset: (currentPage - 1) * perPage
    })

    data = data.map((row) => {
      row.dataValues.total = row.dataValues.ReservationDetails.reduce((acc, curr) => {
        return acc + (curr.dataValues.price * curr.dataValues.quantity) 
      }, 0)
      row.dataValues['ReservationStatus.id'] = row.dataValues.ReservationStatus.id
      row.dataValues['ReservationStatus.status'] = row.dataValues.ReservationStatus.status
      delete row.dataValues.ReservationStatus
      delete row.dataValues.ReservationDetails
      return row
    })
    return res.json({ result: true, data: {count: data.length, rows: data}})
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

    // Construir la condición de filtro
    const filterCondition = {
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true,
      where: {
        [Op.or]: [
          where(
            cast(col('rent'), 'CHAR'), {[Op.like]: `%${filter}%`}
          ),
          { name: { [Op.like]: `%${filter}%` } },
          { address: { [Op.like]: `%${filter}%` } },
          { telephone: { [Op.like]: `%${filter}%` } },
          { email: { [Op.like]: `%${filter}%` } }
        ]
      }
    }
    // Realizar la consulta con paginación y filtros
    const data = await Reservation.findAndCountAll(filterCondition)
    return res.json({ result: true, data }) 
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

module.exports = {
  add,
  update,
  remove,
  getAll,
  paginate, 
  filterAndPaginate
}