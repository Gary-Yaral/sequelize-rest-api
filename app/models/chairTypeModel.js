const db = require('../database/config')
const Sequelize = require('sequelize')

const ChairType = db.define(
  'ChairType',
  {
    type:  {
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
  },
  { 
    tableName: 'chair_type',
    timestamps: false
  } 
)

ChairType.sync()
  .then(() => {
    console.log('ChairType table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ChairType
