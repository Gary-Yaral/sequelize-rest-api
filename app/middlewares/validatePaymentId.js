const { PAYMENT_STATUS } = require('../constants/db_constants')
const Payment = require('../models/payment.model')

async function validatePayment(req, res, next) {
  if(!req.params.reservationId) {
    return res.status(404).json({error: true, msg:'Page not found'})
  }
  const { reservationId } = req.params
  const found = await Payment.findOne({where: {reservationId}})
  if(!found) {
    return res.status(404).json({error: true, msg:'Payment no found'})
  }
  if(found.paymentStatusId !== PAYMENT_STATUS.POR_REVISAR ) {
    return res.status(404).json({error: true, msg:'URL is not valid'})
  }
  req.body.found = found
  next()
}

module.exports = { validatePayment }