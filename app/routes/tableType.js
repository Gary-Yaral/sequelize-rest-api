
const tableTypeController = require('../controllers/tableTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { typeValidator } = require('../validators/commonValidator')
const { findId } = require('../middlewares/findId')
const TableType = require('../models/tableTypeModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Table-Type', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/', validateToken, tableTypeController.paginate)
router.post('/', validateToken, upload.single('image'), typeValidator, tableTypeController.add)
router.post('/filter', validateToken, tableTypeController.filterAndPaginate)
router.put('/:id', validateToken, findId(TableType), upload.single('image'), typeValidator, tableTypeController.update)
router.delete('/:id', validateToken, findId(TableType), tableTypeController.remove)

module.exports = { router }