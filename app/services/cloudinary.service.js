const { uploadImage, deleteImageFromCloud } = require('../cloudinary/config')
const { Uploader } = require('./toImplement/uploader')

class CloudinaryService extends Uploader {
  folderCloudinary = ''
  constructor() {
    super()
  }

  setFolder(folderCloudinary) {
    this.folderCloudinary = folderCloudinary
  }
  
  async upload(imgName) {
    return await uploadImage(imgName, this.folderCloudinary)
  }

  async delete(publicId) {
    return await deleteImageFromCloud(publicId)
  }
}

module.exports = { CloudinaryService }