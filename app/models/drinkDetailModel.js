const db = require('../database/config')
const Sequelize = require('sequelize')
const Drink = require('./drinkModel')
const Package = require('./packageModel')

const DrinkDetail = db.define(
  'DrinkDetail',
  {
    itemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Drink,
        key: 'id',
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
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
    tableName: 'drink_detail',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
Drink.hasMany(DrinkDetail, { foreignKey: 'itemId' })
DrinkDetail.belongsTo(Drink, { foreignKey: 'itemId' })

Package.hasMany(DrinkDetail, { foreignKey: 'packageId' })
DrinkDetail.belongsTo(Package, { foreignKey: 'packageId' })

DrinkDetail.sync()
  .then(() => {
    console.log('DrinkDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DrinkDetail
