const db = require('../database/config')
const Sequelize = require('sequelize')

const TableType = db.define(
  'TableType',
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
    tableName: 'table_type',
    timestamps: false
  } 
)

TableType.sync()
  .then(() => {
    console.log('TableType table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = TableType
