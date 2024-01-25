const jwt = require('jsonwebtoken')
require('dotenv').config()

// Clave secreta para firmar y verificar el token
const SECRET_KEY = process.env.SECRET_KEY

// Función para crear un token
function createToken(data) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: '1h' })
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

module.exports = { createToken, verifyToken }
