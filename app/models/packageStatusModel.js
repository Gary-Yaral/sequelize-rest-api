const db = require('../database/config')
const Sequelize = require('sequelize')

const PackageStatus = db.define(
  'PackageStatus',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    tableName: 'package_status',
    timestamps: false
  } 
)

PackageStatus.sync()
  .then(() => {
    console.log('PackageStatus table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = PackageStatus
