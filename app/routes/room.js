
const roomController = require('../controllers/roomController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
const { findId } = require('../middlewares/findId')
const { roomValidator } = require('../validators/commonValidator')
const Room = require('../models/roomModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/images/')
  },
  filename: function (req, file, cb) {
    if(!file){
      req.image = ''
    }
    const ext = path.extname(file.originalname)
    const fileName = newImageName('Room', ext).filename
    req.body.image = fileName
    cb(null, fileName)
  }
})

const upload = multer({ storage })

router.get('/', validateToken, roomController.paginate)
router.post('/', validateToken, upload.single('image'), roomValidator, roomController.add)
router.post('/filter', validateToken, roomController.filterAndPaginate)
router.put('/:id', validateToken, findId(Room), upload.single('image'), roomValidator, roomController.update)
router.delete('/:id', validateToken, findId(Room), roomController.remove)

module.exports = { router}