const db = require('../database/config')
const Sequelize = require('sequelize')

const Package = db.define(
  'Package',
  {
    code:  {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { 
    tableName: 'package',
    timestamps: false
  } 
)

Package.sync()
  .then(() => {
    console.log('Package table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Package
