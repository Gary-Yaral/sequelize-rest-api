
const chairTypeController = require('../controllers/chairTypeController')
const { validateToken } = require('../middlewares/auth')
const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const { newImageName } = require('../utils/saveImage')
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

const upload = multer({ storage: storage })

router.get('/', validateToken, chairTypeController.getAll)
router.post('/', validateToken, upload.single('image'), chairTypeController.add)
router.put('/:id', upload.single('image'), chairTypeController.update)
router.delete('/:id', chairTypeController.remove)

module.exports = { router}