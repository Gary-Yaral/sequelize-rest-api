const jwt = require('jsonwebtoken')
const { caducity } = require('../utils/jwt')

// Middleware para verificar el token en rutas protegidas
function validateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  
  // Si no existe la cabecera retornamos un error
  if (!authHeader) {
    return res.status(403).json({ message: 'Token not found' })
  }
  // Separamos lo que se envio en la cabecera
  const tokenParts = authHeader.split(' ')
  // Verificamos si hay dos cadenas y verificamos si existe la cadena bearer
  if(tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Invalid header' })
  }

  // Verificamos el token que se recibió en la posicion 1
  jwt.verify(tokenParts[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    // Validamos la caducidad del token
    if(!caducity(decoded).isValid){
      return res.status(401).json({ message: 'Expired token' })
    }
    // Guardamos el token variable usuario de la petición
    req.user = decoded
    next()
  })
}

module.exports = { validateToken }