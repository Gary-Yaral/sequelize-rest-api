const UserStatus = require('../models/userStatusModel')

async function getAll(req, res) {
  try {
    const data = await UserStatus.findAll()
    if(data.length > 0) {
      return res.json({ data })
    }
    return res.json({
      error: 'No se han podido obtener los estados del usuario'
    })
  } catch (error) {
    return res.json({error})
  }
}

module.exports = {
  getAll
}