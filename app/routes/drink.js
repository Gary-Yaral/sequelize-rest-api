
const drinkController = require('../controllers/drinkController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { findId } = require('../middlewares/findId')
const { typeValidator2 } = require('../validators/commonValidator')
const Drink = require('../models/drinkModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Drink', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/', validateToken, drinkController.paginate)
router.post('/', validateToken, upload.single('image'), typeValidator2, drinkController.add)
router.post('/filter', validateToken, drinkController.filterAndPaginate)
router.put('/:id', validateToken, findId(Drink), upload.single('image'), typeValidator2, drinkController.update)
router.delete('/:id', validateToken, findId(Drink), drinkController.remove)

module.exports = { router}