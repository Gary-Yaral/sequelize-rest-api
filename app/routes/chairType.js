
const chairTypeController = require('../controllers/chairTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { findId } = require('../middlewares/findId')
const { typeValidator } = require('../validators/commonValidator')
const ChairType = require('../models/chairTypeModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Chair-Type', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/list', validateToken, chairTypeController.getAll)
router.get('/', validateToken, chairTypeController.paginate)
router.post('/', validateToken, upload.single('image'), typeValidator, chairTypeController.add)
router.post('/filter', validateToken, chairTypeController.filterAndPaginate)
router.put('/:id', validateToken, findId(ChairType), upload.single('image'), typeValidator, chairTypeController.update)
router.delete('/:id', validateToken, findId(ChairType), chairTypeController.remove)

module.exports = { router}