const db = require('../database/config')
const Sequelize = require('sequelize')
const PackageStatus = require('./packageStatusModel')
const UserRole = require('./userRoleModel')

const Package = db.define(
  'Package',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: true
    },
    status:{
      type: Sequelize.INTEGER,
      allowNull: false,
      refrences: {
        model: PackageStatus,
        key: ['id']
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
