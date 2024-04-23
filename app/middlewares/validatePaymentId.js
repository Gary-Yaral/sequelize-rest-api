const { PAYMENT_STATUS } = require('../constants/db_constants')
const Payment = require('../models/payment.model')
const Reservation = require('../models/reservation.model')
const ReservationSchedules = require('../models/reservationSchedule.model')
const Room = require('../models/room.model')
const ScheduleType = require('../models/sheduleType.model')
const User = require('../models/userModel')
const UserRoles = require('../models/userRoleModel')

async function validatePayment(req, res, next) {
  if(!req.params.reservationId) {
    return res.status(404).json({error: true, msg:'Page not found'})
  }
  const { reservationId } = req.params
  const found = await Payment.findOne({
    include: [
      {
        model:Reservation,
        include: [
          {
            model: UserRoles,
            include: [User]
          },
          Room,
          ReservationSchedules,
          ScheduleType
        ]
      }
    ],
    where: {reservationId}
  })
  if(!found) {
    return res.status(404).json({error: true, msg:'Payment no found'})
  }
  if(found.paymentStatusId !== PAYMENT_STATUS.POR_REVISAR ) {
    return res.status(404).json({error: true, msg:'URL is not valid'})
  }
  req.body.found = found.dataValues
  console.log(req.body.found.Reservation)
  next()
}

module.exports = { validatePayment }