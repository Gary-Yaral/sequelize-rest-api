const { CleanFolderService } = require('./clearFolder.service')

class ImageUploaderService {
  uploader
  service
  constructor(service) {
    this.service = service
  }

  async upload(imgName) {
    if(!this.service.upload) {
      throw Error('Debe implementarse el metodo upload en el servicio')
    }
    const uploadResult = await this.service.upload(imgName)
    const cleanResult = this.cleanFolder()
    if(cleanResult.error) { return cleanResult }
    return uploadResult
  }

  async delete(oldPublicId) {
    return await this.service.delete(oldPublicId)
  }

  cleanFolder() {
    return new CleanFolderService('./app/images/').clear()
  }
}

module.exports = { ImageUploaderService }