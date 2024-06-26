
const reservationController = require('../controllers/reservation.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const Reservation = require('../models/reservation.model')

router.get('/list', validateToken, reservationController.getAll)
router.get('/statuses', validateToken, reservationController.getStatusTypes)
router.get('/types', validateToken, reservationController.getScheduleTypes)
router.post('/package', validateToken, reservationController.getReservationPackageData)
router.get('/', validateToken, reservationController.paginate)
router.post('/', validateToken, reservationController.add)
router.put('/status/:id', validateToken, reservationController.updateReservationStatus)
router.post('/filter', validateToken, reservationController.filterAndPaginate)
router.put('/:id', validateToken, findId(Reservation), reservationController.update)
router.delete('/:id', validateToken, findId(Reservation), reservationController.remove)

module.exports = { router}