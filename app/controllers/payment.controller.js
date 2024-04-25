const db = require('../database/config')
const { Op, col, where, json } = require('sequelize')
const Payment = require('../models/payment.model')
const PaymentStatus = require('../models/paymentStatus.model')
const Reservation = require('../models/reservation.model')
const ReservationSchedules = require('../models/reservationSchedule.model')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')
const { PAYMENT_STATUS, DEFAULT_PAYMENT_IMAGE_PUBLIC_ID, RESERVATION_STATUS, PROCESS_VOUCHER_ROUTE_FULL } = require('../constants/db_constants')
const { ImageUploaderService } = require('../services/uploadImage.service')
const { EmailService } = require('../services/email.service')
const { paymentApprovedMsg } = require('../email/types/paymentApproved')
const { paymentDeniedMsg } = require('../email/types/paymentDenied')
const { paymentReceivedMsg } = require('../email/types/paymentRecieved')
const { getEndPointRoute, emitStateChange, emitVoucherChange } = require('../utils/server')

const imageUploaderService = ImageUploaderService.service
imageUploaderService.setFolder('payments')

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
    // Si el pago ya fue procesado retornamos
    if(payment.paymentStatusId !== PAYMENT_STATUS.WAITING) {
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
      // Guardamos los cambios
      await transaction.commit()
      await emitVoucherChange(req, 'Voucher fué actualizado')
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

async function remove(req, res) {
  const transaction = await db.transaction()
  try {
    const { id } = req.params
    const { reservationId, publicId, paymentStatusId } = req.body.found.dataValues
    // No permitira eliminar si ya fue aprobada
    if(paymentStatusId === PAYMENT_STATUS.APPROVED) {
      return res.json({error: true, msg: 'No es posible eliminar el pago, ya ha sido aprobado'})
    }
    // Eliminamos el pago y actualizamos la reservación
    await Payment.destroy({where:{id}, transaction})
    await Reservation.update({statusId: RESERVATION_STATUS.WAITING}, {where: {id: reservationId}})
    // Guardamos los cambios y emitimos el evento
    await transaction.commit()
    await emitStateChange(req, 'Pago fue eliminado')
    // Eliminamos la imagen del voucher en caso de tener
    if(publicId !== DEFAULT_PAYMENT_IMAGE_PUBLIC_ID) {
      const deleteResult = await imageUploaderService.delete(publicId)
      if(deleteResult.error) {
        return res.json(deleteResult)
      }
    }
    return res.json({done: true, msg: 'Pago ha sido eliminado correctamente, reservación cambió a EN ESPERA'})
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({error: true, msg: 'Error al eliminar el pago'})
  }
}

async function updateStatus(req, res) {
  const transaction = await db.transaction()
  try {
    const { paymentId } = req.params
    const { paymentStatusId } = req.body
    const { reservationId } = req.body.found
    // Actualizamos el estado del pago
    await Payment.update({paymentStatusId},{where: {id: paymentId}})
    // Creamos el link de actualización de voucher
    const link = getEndPointRoute(req, PROCESS_VOUCHER_ROUTE_FULL + reservationId)
    // Enviamos el email correspondiente
    const sendEmailResult = await sendEmail(reservationId, paymentStatusId, link)
    // Si ocurre un error al enviar el mensaje retornamos un error
    if(sendEmailResult.error) {
      await transaction.rollback()
      return res.json(sendEmailResult)
    }
    // Si todo va bien guardamos los cambios y emitimos el evento
    await transaction.commit()
    await emitStateChange(req, 'Pago cambió de estado')
    return res.json({done: true, msg: 'El estado del pago ha sido actualizado'})
  } catch (error) {
    console.log(error)
    await transaction.commit()
    return res,json({error: true, msg : ''})
  }
}

async function sendEmail(reservationId, paymentStatusId, link) {
  try {
    const reservation = await Reservation.findOne({
      include: [{
        model: UserRoles,
        include: [User]
      }],
      where: {id: reservationId}
    })
    const userEmail = reservation.UserRole.User.email
    const msgData = createdEmailMsg(paymentStatusId, link)
    const emailData = {
      email: userEmail,
      subject: msgData.subject,
      text: msgData.msg,
      type: 'html'
    }
    return await EmailService.email.send(emailData)
  } catch (error) {
    console.log(error)
    return {error: true, msg: 'Error al enviar mensaje de actualización de estado del pago'}
  }
}

function createdEmailMsg(paymentStatusId, link) {
  console.log('status: ', paymentStatusId)
  if(paymentStatusId === PAYMENT_STATUS.APPROVED) {
    return { 
      subject: '¡Pago Aprobado!',
      msg: paymentApprovedMsg()
    }
  }
  if(paymentStatusId === PAYMENT_STATUS.DENIED) {
    return { 
      subject: '¡Pago Rechazado!',
      msg: paymentDeniedMsg()
    }
  }
  if(paymentStatusId === PAYMENT_STATUS.WAITING) {
    return { 
      subject: 'Pago En Espera',
      msg: paymentReceivedMsg(link)
    }
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
    const payments = await Payment.findAll()
    return res.json({ data: payments })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los pagos' })
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params
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
  getAll,
  findOne,
  paginate,
  updateVoucher, 
  updateStatus,
  getPaymentStatuses,
  filterAndPaginate,
  processVoucher,
  remove
}