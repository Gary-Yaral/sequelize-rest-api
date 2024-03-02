const db = require('../database/config')
const Sequelize = require('sequelize')

const DishType = db.define(
  'DishType',
  {
    type: {
      type: Sequelize.STRING,
      require: true,
    },
  },
  { 
    tableName: 'dish_type',
    timestamps: false
  } 
)

DishType.sync()
  .then(() => {
    console.log('DishType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DishType
