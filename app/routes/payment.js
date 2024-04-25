
const paymentController = require('../controllers/payment.controller')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { PROCESS_VOUCHER_ROUTE } = require('../constants/db_constants')
const { validateToken } = require('../middlewares/auth')
const { findId } = require('../middlewares/findId')
const { validatePayment } = require('../middlewares/validatePaymentId')
const { newImageName } = require('../utils/saveImage')
const Payment = require('../models/payment.model')
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
router.get('/list', validateToken, paymentController.getAll)
router.get(`${PROCESS_VOUCHER_ROUTE}:reservationId`, validatePayment, paymentController.processVoucher)
router.get('/', validateToken, paymentController.paginate)
router.get('/statuses', validateToken, paymentController.getPaymentStatuses)
router.post('/filter', validateToken, paymentController.filterAndPaginate)
router.put('/voucher/:paymentId', upload.single('voucher'), paymentController.updateVoucher)
router.put('/status/:paymentId', validateToken, findId(Payment, {prop: 'paymentId'}), paymentController.updateStatus)
router.delete('/:id', validateToken, findId(Payment), paymentController.remove)

module.exports = { router}