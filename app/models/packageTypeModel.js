const db = require('../database/config')
const Sequelize = require('sequelize')

const PackageType = db.define(
  'PackageType',
  {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    tableName: 'package_type',
    timestamps: false
  } 
)

PackageType.sync()
  .then(() => {
    console.log('PackageType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = PackageType
