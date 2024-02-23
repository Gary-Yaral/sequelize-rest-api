const db = require('../database/config')
const Sequelize = require('sequelize')

const TableType = db.define(
  'TableType',
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
    image: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'chair_type',
    timestamps: false
  } 
)

TableType.sync()
  .then(() => {
    console.log('Table table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = TableType
