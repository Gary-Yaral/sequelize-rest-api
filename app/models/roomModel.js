const db = require('../database/config')
const Sequelize = require('sequelize')

const Room = db.define(
  'Room',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telephone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rent: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    tableName: 'room',
    timestamps: false
  } 
)

Room.sync()
  .then(() => {
    console.log('Room table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Room
