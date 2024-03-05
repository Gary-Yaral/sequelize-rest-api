const db = require('../database/config')
const Sequelize = require('sequelize')
const PackageType = require('./packageTypeModel')

const Package = db.define(
  'Package',
  {
    code:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    name:  {
      type: Sequelize.STRING,
      allowNull: true
    },
    typeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: PackageType,
        key: 'id'
      }
    }
  },
  { 
    tableName: 'package',
    timestamps: false
  } 
)

// Creamos las relaciones entre modelos
PackageType.hasMany(Package, { foreignKey: 'typeId' })
Package.belongsTo(PackageType, { foreignKey: 'typeId' })

Package.sync()
  .then(() => {
    console.log('Package table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Package
