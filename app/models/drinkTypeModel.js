const db = require('../database/config')
const Sequelize = require('sequelize')

const DrinkType = db.define(
  'DrinkType',
  {
    type: {
      type: Sequelize.STRING,
      require: true,
    },
  },
  { 
    tableName: 'drink_type',
    timestamps: false
  } 
)

DrinkType.sync()
  .then(() => {
    console.log('DrinkType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DrinkType
