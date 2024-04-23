const { uploadImage } = require('../cloudinary/config')

class CloudinaryService {
  async upload(imgName, folderCloudinary = '') {
    await uploadImage(imgName, folderCloudinary)
  }
}

module.exports = { CloudinaryService }