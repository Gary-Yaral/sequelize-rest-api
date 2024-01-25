const bcrypt = require('bcrypt')

async function generateHash(contrasena) {
  const saltRounds = 10 // Número de rondas de sal (ajústalo según tus necesidades)
  try {
    const hash = await bcrypt.hash(contrasena, saltRounds)
    return hash
  } catch (error) {
    throw new Error('Error to generate hash: ' + error.message)
  }
}

async function validateHash(password, savedHash) {
  try {
    const match = await bcrypt.compare(password, savedHash)
    return match
  } catch (error) {
    throw new Error('Error to compare password with hash: ' + error.message)
  }
}

module.exports = {
  generateHash,
  validateHash,
}
