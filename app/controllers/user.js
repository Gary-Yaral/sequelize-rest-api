const User = require('../models/userModel')

async function add(req, res) {
  try {
    const username = req.body.user
    const found = await User.findOne({
      where: {
        user: username
      }
    })

    res.json(found) // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.status(500).json({ mensaje: 'Has been error', error: error.message })
  }
}

module.exports = {
  add
}