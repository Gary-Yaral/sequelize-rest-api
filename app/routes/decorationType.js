
const decorationTypeController = require('../controllers/decorationTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { typeValidator } = require('../validators/commonValidator')
const { findId } = require('../middlewares/findId')
const DecorationType = require('../models/decorationTypeModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Decoration-Type', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/list', validateToken, decorationTypeController.getAll)
router.get('/', validateToken, decorationTypeController.paginate)
router.post('/', validateToken, upload.single('image'), typeValidator, decorationTypeController.add)
router.post('/filter', validateToken, decorationTypeController.filterAndPaginate)
router.put('/:id', validateToken, findId(DecorationType), upload.single('image'), typeValidator, decorationTypeController.update)
router.delete('/:id', validateToken, findId(DecorationType), decorationTypeController.remove)

module.exports = { router }