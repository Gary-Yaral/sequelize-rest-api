const db = require('../database/config')
const Sequelize = require('sequelize')
const DrinkType = require('./drinkTypeModel')

const Drink = db.define(
  'Drink',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    typeId:  {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: DrinkType,
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
    tableName: 'drink',
    timestamps: false
  } 
)
// Establecemos las relaciones entre modelos
DrinkType.hasMany(Drink, { foreignKey: 'typeId' })
Drink.belongsTo(DrinkType, { foreignKey: 'typeId' })

Drink.sync()
  .then(() => {
    console.log('Drink table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Drink
