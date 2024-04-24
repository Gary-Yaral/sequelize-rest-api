const db = require('../database/config')
const { Op, col, where, json } = require('sequelize')
const Payment = require('../models/payment.model')
const PaymentStatus = require('../models/paymentStatus.model')
const Reservation = require('../models/reservation.model')
const ReservationSchedules = require('../models/reservationSchedule.model')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { PAYMENT_STATUS, DEFAULT_PAYMENT_IMAGE_PUBLIC_ID } = require('../constants/db_constants')
const { ImageUploaderService } = require('../services/uploadImage.service')
const { CloudinaryService } = require('../services/cloudinary.service')

const imageUploaderService = new ImageUploaderService(new CloudinaryService('payments'))

async function add(req, res) {
  const transaction = await db.transaction()
  try {
    //
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

async function updateVoucher(req, res) {
  const transaction = await db.transaction()
  try {
    const { paymentId } = req.params
    const payment = await Payment.findOne({where: {id: paymentId}})
    // Si el pago no existe retornamos error
    if(!payment) {
      await transaction.rollback()
      return res.status(404).json({error: true, msg: 'Pago no fue encontrado'})
    }
    if(payment.paymentStatusId !== PAYMENT_STATUS.POR_REVISAR) {
      await transaction.rollback()
      return res.status(400).json({error: true, msg: 'Pago ya fue procesado, no es posible actualizar'})
    }
    // Subimos la nueva imagen del voucher
    const uploadResult = await imageUploaderService.upload(req.body.image)
    // Solo si no hubo error al subir la imagen actualizamos el voucher
    if(!uploadResult.error) {
      let { secure_url, public_id } = uploadResult
      const data = { image: secure_url, publicId: public_id }
      // Actualizamos la imagen del voucher
      await Payment.update(data,{ where: {id: paymentId}}, {transaction}) 
      // Verificamos si no tenia imagen una imagen por defecto cargada previamente 
      if(payment.publicId !== DEFAULT_PAYMENT_IMAGE_PUBLIC_ID) {
        const deleteResult = await imageUploaderService.delete(payment.publicId)
        // Si no se pudo eliminar la imagen previa entonces deshacemos los cambios y devolvemos error
        if(deleteResult.error) {
          await transaction.rollback()
          return res.status(400).json({error: true, msg: 'Error al eliminar la imagen previa del voucher'})
        }
      }
      await transaction.commit()
      return res.json({done: true, msg: 'Se ha actualizado el estado del pago'})
    }
    // Si hubo error al subir la imagen del voucher retornamos error
    await transaction.rollback()
    return res.status(400).json({error: true, msg: 'No se pudo actualizar el voucher del pago'})
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({error: true, msg: 'Error al actualizar el estado del pago'})
  }
}

async function updateStatus(req, res) {
  const transaction = await db.transaction()
  try {
    const { paymentId } = req.params
    const { paymentStatusId } = req.body
    await Payment.update({paymentStatusId},{where: {id: paymentId}})
    await transaction.commit()
    const io = req.app.get('io')
    io.emit('payment-status-updated', 'Pago ya fue aprobado')
    return res.json({done: true, msg: 'El estado del pago ha sido actualizado'})
  } catch (error) {
    console.log(error)
    return res,json({error: true, msg : ''})
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
  updateVoucher, 
  updateStatus,
  getPaymentStatuses,
  filterAndPaginate,
  processVoucher
}