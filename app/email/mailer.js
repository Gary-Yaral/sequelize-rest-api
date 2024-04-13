const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
require('dotenv').config()

const accountTransport = {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.AUTH_USER,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    refreshToken: process.env.AUTH_REFRESH_TOKEN
  }
}

// Configura el correo electrónico que deseas enviar
/* const mailOptions = {
  email: 'user.test@gmail.com',
  subject: 'Importante',
  text: 'Message',
} */

const sendMail = (emailData) => {
  return new Promise((resolve, reject) => {
    const oauth2Client = new OAuth2(
      accountTransport.auth.clientId,
      accountTransport.auth.clientSecret,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token: accountTransport.auth.refreshToken,
    })

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: accountTransport.auth.user,
        clientId: accountTransport.auth.clientId,
        clientSecret: accountTransport.auth.clientSecret,
        refreshToken: accountTransport.auth.refreshToken,
        accessToken: accountTransport.auth.accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Configura el correo electrónico que deseas enviar
    const mailOptions = {
      from: accountTransport.auth.user,
      to: emailData.email,
      subject: emailData.subject,
      text: emailData.text,
    }

    // En caso de que el tipo sea html
    if (emailData.type === 'html') {
      delete mailOptions.text
      mailOptions.html = emailData.text
    }

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error)
        reject({error: true, data: error})
      } else {
        console.log('Correo enviado con éxito:', info.response)
        resolve({done: true, data: info, email: emailData.email})
      }
    })
  })
}

module.exports = { sendMail }
