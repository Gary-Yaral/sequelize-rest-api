
const dishController = require('../controllers/dishController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { findId } = require('../middlewares/findId')
const { typeValidator2 } = require('../validators/commonValidator')
const Dish = require('../models/dishModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Dish', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/list', validateToken, dishController.getAll)
router.get('/', validateToken, dishController.paginate)
router.post('/', validateToken, upload.single('image'), typeValidator2, dishController.add)
router.post('/filter', validateToken, dishController.filterAndPaginate)
router.put('/:id', validateToken, findId(Dish), upload.single('image'), typeValidator2, dishController.update)
router.delete('/:id', validateToken, findId(Dish), dishController.remove)

module.exports = { router}