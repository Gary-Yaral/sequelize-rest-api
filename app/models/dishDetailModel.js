const db = require('../database/config')
const Sequelize = require('sequelize')
const Dish = require('./dishModel')
const Package = require('./packageModel')

const DishDetail = db.define(
  'DishDetail',
  {
    itemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Dish,
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
    tableName: 'dish_detail',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
Dish.hasMany(DishDetail, { foreignKey: 'itemId' })
DishDetail.belongsTo(Dish, { foreignKey: 'itemId' })

Package.hasMany(DishDetail, { foreignKey: 'packageId' })
DishDetail.belongsTo(Package, { foreignKey: 'packageId' })

DishDetail.sync()
  .then(() => {
    console.log('DishDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = DishDetail
