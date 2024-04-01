
const reservationController = require('../controllers/reservation.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const { findId } = require('../middlewares/findId')
const { roomValidator } = require('../validators/room.validator')
const Room = require('../models/room.model')

router.get('/list', validateToken, reservationController.getAll)
router.get('/', validateToken, reservationController.paginate)
router.post('/', validateToken, reservationController.add)
router.post('/filter', validateToken, reservationController.filterAndPaginate)
router.put('/:id', validateToken, findId(Room), reservationController.update)
router.delete('/:id', validateToken, findId(Room), reservationController.remove)

module.exports = { router}