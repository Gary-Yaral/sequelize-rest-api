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
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    },
    m2: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    capacity: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    minTimeRent: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    publicId: {
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
