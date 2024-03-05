const db = require('../database/config')
const Sequelize = require('sequelize')
const Package = require('./packageModel')
const ChairType = require('./chairTypeModel')

const ChairDetail = db.define(
  'ChairDetail',
  {
    itemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ChairType,
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
    tableName: 'chair_detail',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
ChairType.hasMany(ChairDetail, { foreignKey: 'itemId' })
ChairDetail.belongsTo(ChairType, { foreignKey: 'itemId' })

Package.hasMany(ChairDetail, { foreignKey: 'packageId' })
ChairDetail.belongsTo(Package, { foreignKey: 'packageId' })

ChairDetail.sync()
  .then(() => {
    console.log('ChairDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ChairDetail
