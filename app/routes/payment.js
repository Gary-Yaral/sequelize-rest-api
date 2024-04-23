
const { PROCESS_VOUCHER_ROUTE } = require('../constants/db_constants')
const paymentController = require('../controllers/payment.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
/* const { findId } = require('../middlewares/findId') */
const { validatePayment } = require('../middlewares/validatePaymentId')
const { newImageName } = require('../utils/saveImage')
/* const Payment = require('../models/payment.model') */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = '' 
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('VOUCHER', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

/* router.get('/:id', validateToken, reservationController.findOne) */
router.get('/list', validateToken, paymentController.getAll)
router.get(`${PROCESS_VOUCHER_ROUTE}:reservationId`, validatePayment, paymentController.processVoucher)
router.get('/', validateToken, paymentController.paginate)
router.get('/statuses', validateToken, paymentController.getPaymentStatuses)
router.post('/filter', validateToken, paymentController.filterAndPaginate)
router.put('/status/:id', upload.single('voucher'), paymentController.updateStatus)
/*router.get('/statuses', validateToken, reservationController.getStatusTypes)
router.get('/types', validateToken, reservationController.getScheduleTypes)
router.post('/package', validateToken, reservationController.getReservationPackageData)
router.post('/', validateToken, reservationController.add)
router.put('/:id', validateToken, findId(Reservation), reservationController.update)
router.delete('/:id', validateToken, findId(Reservation), reservationController.remove) */

module.exports = { router}