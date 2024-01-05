const jwt = require('jsonwebtoken')

function createToken(data) {
  return jwt.sign(data, process.env.SECRET_KEY)
}

module.exports = { createToken }