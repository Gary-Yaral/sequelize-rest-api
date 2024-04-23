const { uploadImage, deleteImageFromCloud } = require('../cloudinary/config')

class CloudinaryService {
  folderCloudinary = ''
  constructor(folderCloudinary) {
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