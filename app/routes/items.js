
const itemController = require('../controllers/item.controller')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { itemValidator } = require('../validators/item.validator')
const { findId } = require('../middlewares/findId')
const Item = require('../models/item.model')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName(req.query.subcategory, ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.post('/filter', validateToken, itemController.filterAndPaginate)
router.post('/', validateToken, upload.single('image'), itemValidator, itemController.add)
router.get('/', validateToken, itemController.paginate)
router.get('/subcategory/:id', validateToken, itemController.findBySubcategory)
router.delete('/:id', validateToken, findId(Item), itemController.remove)
router.put('/:id', validateToken, upload.single('image'), findId(Item), itemController.update)

module.exports = { router}