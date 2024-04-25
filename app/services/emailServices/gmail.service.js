const { sendMail } = require('../../email/mailer')
const { Email } = require('../toImplement/email') 

/* Ejemplo de data para este servicio
  const emailData = {
    email: 'user.test@gmail.com',
    subject: 'Importante',
    text: 'Message',
    type: 'html'
  }
*/ 

class Gmail extends Email{
  constructor() {
    super()
  }

  async send(emailData) {
    return await sendMail(emailData)
  }
}

module.exports = { Gmail }