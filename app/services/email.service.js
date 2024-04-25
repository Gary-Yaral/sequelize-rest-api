const { Gmail } = require('./emailServices/gmail.service')

class EmailServices {
  email = null
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
      this.email = found.service
    } else {
      throw Error(`${type} service type not exist in EmailServices`)
    }
  }
}

const EmailService = new EmailServices()
  .addService({service: new Gmail(), type: 'GMAIL'})

EmailService.setType(EmailService.serviceTypes.GMAIL)

module.exports = { EmailService }