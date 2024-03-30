const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const OPTIONS_TOKEN = {
  create: 'create',
  refresh: 'refresh'
}

// Clave secreta para firmar y verificar el token

// Función para crear un token
function createToken(data, option) {
  if(option === OPTIONS_TOKEN.create) {
    return jwt.sign({data}, SECRET_KEY, { expiresIn: '1h' })
  }
  if(option === OPTIONS_TOKEN.refresh) {
    return jwt.sign({data}, REFRESH_SECRET_KEY)
  }
}

// Función para verificar un token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return { success: true, decoded }
  } catch (error) {
    return { success: false, error: 'Token no válido' }
  }
}


function caducity(decoded) {
  try {
    // Obtiene la fecha de expiración del token
    const exp = decoded.exp 
    // Obtiene la fecha y hora actual en segundos
    const currentDate = Math.floor(Date.now() / 1000) 
    if (exp < currentDate) {
      return {isValid: false, exp}
    } else {
      return {isValid: true, exp}
    }
  } catch (error) {
    return {error}
  }
}

module.exports = { createToken, verifyToken, caducity, OPTIONS_TOKEN }
