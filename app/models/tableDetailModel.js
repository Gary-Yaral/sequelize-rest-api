const db = require('../database/config')
const Sequelize = require('sequelize')
const Package = require('./packageModel')
const TableType = require('./tableTypeModel')

const TableDetail = db.define(
  'TableDetail',
  {
    itemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: TableType,
        key: 'id',
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    total: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    packageId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Package,
        key: 'id'
      }
    },
  },
  { 
    tableName: 'table_detail',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
TableType.hasMany(TableDetail, { foreignKey: 'itemId' })
TableDetail.belongsTo(TableType, { foreignKey: 'itemId' })

Package.hasMany(TableDetail, { foreignKey: 'packageId' })
TableDetail.belongsTo(Package, { foreignKey: 'packageId' })

TableDetail.sync()
  .then(() => {
    console.log('TableDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = TableDetail
