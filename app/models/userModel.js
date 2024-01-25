const db = require('../database/config')
const Sequelize = require('sequelize')

const User = db.define(
  'User',
  {
    dni: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    telephone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Esta validación asegura que el valor sea una dirección de correo electrónico válida
      }
    },
    /* Datos de acceso */
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING, 
    },
  },
  { 
    tableName: 'user',
    timestamps: false
  }
)
User.sync()
  .then(() => {
    console.log('User table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = User
