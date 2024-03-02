const db = require('../database/config')
const Sequelize = require('sequelize')
const DishType = require('./dishTypeModel')

const Dish = db.define(
  'Dish',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    typeId:  {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: DishType,
        key: 'id',
      },
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'dish',
    timestamps: false
  } 
)
// Establecemos las relaciones entre modelos
DishType.hasMany(Dish, { foreignKey: 'typeId' })
Dish.belongsTo(DishType, { foreignKey: 'typeId' })

Dish.sync()
  .then(() => {
    console.log('Dish table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Dish
