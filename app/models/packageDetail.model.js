const db = require('../database/config')
const Sequelize = require('sequelize')
const Item = require('./item.model')
const Package = require('./package.model')

const PackageDetail = db.define(
  'PackageDetail',
  {
    packageId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Package,
        key: 'id'
      }
    },
    itemId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: 'id'
      }
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    quantity: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  },
  { 
    tableName: 'package_detail',
    timestamps: false
  } 
)

const packForeignKey = 'packageId' 
// Creamos las relaciones entre modelos
Package.hasMany(PackageDetail, { foreignKey: packForeignKey })
PackageDetail.belongsTo(Package, { foreignKey: packForeignKey })

const itemForeignKey = 'itemId' 
Item.hasMany(PackageDetail, { foreignKey: itemForeignKey })
PackageDetail.belongsTo(Item, { foreignKey: itemForeignKey })

PackageDetail.sync()
  .then(() => {
    console.log('PackageDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = PackageDetail
