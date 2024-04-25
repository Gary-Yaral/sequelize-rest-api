const { CleanFolderService } = require('./clearFolder.service')
const { CloudinaryService } = require('./cloudinary.service')

class ImageUploaderServices {
  service = null
  services = []
  serviceTypes = {}
  
  addService(service) {
    if(this.serviceTypes[service.type]) {
      throw Error(`${service.type} service already exists`)
    } else {
      this.serviceTypes[service.type] = service.type
      this.services.push(service)
      return this
    }
  }

  setType(type) {
    const found = this.services.find((service) => service.type === type)
    if(found) {
      this.service = found.service
    } else {
      throw Error(`${type} service type not exist in ImageUplodersServices`)
    }
  }

  async save(imgName) {
    if(!this.service) {
      throw Error('Service type is not defined to save')
    }
    const uploadResult = await this.service.upload(imgName)
    const cleanResult = this.cleanFolder()
    if(cleanResult.error) { return cleanResult }
    return uploadResult
  }

  async delete(oldPublicId) {
    if(!this.service) {
      throw Error('Service type is not defined to delete')
    }
    return await this.service.delete(oldPublicId)
  }

  cleanFolder() {
    return new CleanFolderService('./app/images/').clear()
  }
}
// Creamos la instanacia y añadimos los servicios
const ImageUploaderService = new ImageUploaderServices()
  .addService({service: new CloudinaryService(), type: 'CLOUDINARY'})
// Defninmos el tipo de servicios que se usuará en el proyecto
ImageUploaderService.setType(ImageUploaderService.serviceTypes.CLOUDINARY)

module.exports = { ImageUploaderService }