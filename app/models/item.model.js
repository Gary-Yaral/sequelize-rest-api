const db = require('../database/config')
const Sequelize = require('sequelize')
const Subcategory = require('./subcategory.model')

const Item = db.define(
  'Item',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    subcategoryId:  {
      type: Sequelize.NUMBER,
      allowNull: false,
      references: {
        model: Subcategory,
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
    },
    publicId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'item',
    timestamps: false
  } 
)

const foreignKey = 'subcategoryId'

// Establecemos las relaciones entre modelos
Subcategory.hasMany(Item, { foreignKey })
Item.belongsTo(Subcategory, { foreignKey })

Item.sync()
  .then(() => {
    console.log('Item table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Item
