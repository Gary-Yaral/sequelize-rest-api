const User = require('../models/user')

async function getAll(req, res) {
  try {
    const usuarios = await User.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    res.json(usuarios); // Enviar la lista de usuarios como respuesta
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

module.exports = {
  getAll
}