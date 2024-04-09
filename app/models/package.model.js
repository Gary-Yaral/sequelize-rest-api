const db = require('../database/config')
const Sequelize = require('sequelize')
const PackageStatus = require('./packageStatus.model')
const UserRole = require('./userRoleModel')
const { getCurrentDate } = require('../utils/functions')

const Package = db.define(
  'Package',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastUpdate:  {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: getCurrentDate()
    },
    status:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: PackageStatus,
        key: 'id'
      }
    },
    userRoleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserRole,
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
PackageStatus.hasMany(Package, { foreignKey: 'status' })
Package.belongsTo(PackageStatus, { foreignKey: 'status' })

UserRole.hasMany(Package, { foreignKey: 'userRoleId' })
Package.belongsTo(UserRole, { foreignKey: 'userRoleId' })

Package.sync()
  .then(() => {
    console.log('Package table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Package
