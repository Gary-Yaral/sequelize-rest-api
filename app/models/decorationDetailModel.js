const db = require('../database/config')
const Sequelize = require('sequelize')
const Package = require('./packageModel')
const DecorationType = require('./decorationTypeModel')

const DecorationDetail = db.define(
  'DecorationDetail',
  {
    itemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: DecorationType,
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
    tableName: 'decoration_detail',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
DecorationType.hasMany(DecorationDetail, { foreignKey: 'itemId' })
DecorationDetail.belongsTo(DecorationType, { foreignKey: 'itemId' })

Package.hasMany(DecorationDetail, { foreignKey: 'packageId' })
DecorationDetail.belongsTo(Package, { foreignKey: 'packageId' })

DecorationDetail.sync()
  .then(() => {
    console.log('DecorationDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DecorationDetail
