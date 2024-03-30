const db = require('../database/config')
const Sequelize = require('sequelize')
const Category = require('./category.model')

const Item = db.define(
  'Item',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    categoryId:  {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: Category,
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
    tableName: 'item',
    timestamps: false
  } 
)
// Establecemos las relaciones entre modelos
Category.hasMany(Item, { foreignKey: 'categoryId' })
Item.belongsTo(Category, { foreignKey: 'categoryId' })

Item.sync()
  .then(() => {
    console.log('Item table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Item
