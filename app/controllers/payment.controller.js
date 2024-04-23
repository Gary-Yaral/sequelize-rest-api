const db = require('../database/config')
const { Op, col, where } = require('sequelize')
const Payment = require('../models/payment.model')
const PaymentStatus = require('../models/paymentStatus.model')
const Reservation = require('../models/reservation.model')
const ReservationSchedules = require('../models/reservationSchedule.model')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { PAYMENT_STATUS } = require('../constants/db_constants')
const { getServerData } = require('../utils/server')
const { ImageUploaderService } = require('../services/uploadImage.service')
const { CloudinaryService } = require('../services/cloudinary.service')

const imageUploaderService = new ImageUploaderService(new CloudinaryService('payments'))

async function add(req, res) {
  const transaction = await db.transaction()
  try {
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos de la reservación' })
  }
}

async function update(req, res) {
  const transaction = await db.transaction()
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

async function approvePayment(req, res) {
  const transaction = await db.transaction()
  try {
    // Debo recibir el req.param.id
    console.log(req.body.found)
    /* const uploadResult = await imageUploaderService.upload(req.body.image)
    if(uploadResult) {
      let { secure_url, public_id } = uploadResult
      const data = {
        image: secure_url, 
        publicId: public_id,
        paymentStatusId: PAYMENT_STATUS.APROBADA
      }
      await Payment.update(data,{ where: {id: req.params.id}}, {transaction}) 
      imageUploaderService.delete(req.body.found) */
    await transaction.commit()
    return res.json({done: true, msg: 'Se ha actualizado el estado del pago', server: getServerData(req)})
    /* } */
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({error: true, msg: 'Error al actualizar el estado del pago'})
  }
}

async function remove(req, res) {
  const transaction = await db.transaction()
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
    const payments = await Payment.findAndCountAll({
      include: [
        {
          model: Reservation,
          include: [
            {
              model: UserRoles,
              include: [User]
            },
            ReservationSchedules
          ]
        },
        PaymentStatus
      ],
      raw: true,
      limit: perPage,
      offset
    })
    
    return res.json({ result: true,  data: payments})
  } catch (error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al paginar los pagos' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)
    const offset = (currentPage - 1) * perPage
    const payments = await Payment.findAndCountAll({
      include: [
        {
          model: Reservation,
          include: [
            {
              model: UserRoles,
              include: [User]
            }
          ],
        },
        PaymentStatus
      ],
      where: {
        [Op.or]: [
          where(col('Reservation.date'), { [Op.like]: `%${filter}%` }),
          where(col('Payment.total'), { [Op.like]: `%${filter.toString()}%` }),
          where(col('Reservation->UserRole->User.name'), { [Op.like]: `%${filter}%` }),
          where(col('Reservation->UserRole->User.lastname'), { [Op.like]: `%${filter}%` }),
          where(col('PaymentStatus.status'), { [Op.like]: `%${filter}%` }),
          where(col('Payment.date'), { [Op.like]: `%${filter}%` })
        ]
      },
      raw: true,
      limit: perPage,
      offset
    })
    return res.json({ result: true,  data: payments})
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

async function getPaymentStatuses(req, res) {
  const paymentTypes = await PaymentStatus.findAll()
  return res.json({data: paymentTypes})
}

async function processVoucher(req, res) {
  return res.render('payment', req.body.found)
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  findOne,
  paginate,
  approvePayment, 
  getPaymentStatuses,
  filterAndPaginate,
  processVoucher
}