class ImageUploaderService {
  uploader
  service
  constructor(service) {
    this.service = service
  }

  async upload(imgName, folderCloudinary = '') {
    if(!this.service.upload) {
      throw Error('Debe implementarse el metodo upload en el servicio')
    }
    return await this.service.upload(imgName, folderCloudinary)
  }
}

module.exports = { ImageUploaderService }