const db = require('../database/config')
const Sequelize = require('sequelize')

const DecorationType = db.define(
  'DecorationType',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'decoration_type',
    timestamps: false
  } 
)

DecorationType.sync()
  .then(() => {
    console.log('DecorationType table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DecorationType
