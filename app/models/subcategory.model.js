const db = require('../database/config')
const Sequelize = require('sequelize')
const Category = require('./category.model')

const Subcategory = db.define(
  'Subcategory',
  {
    name:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    categoryId:  {
      type: Sequelize.STRING,
      allowNull: false,
      reference: {
        model: Category,
        key: 'id'
      }
    }
  },
  { 
    tableName: 'subcategory',
    timestamps: false
  } 
)

// Establecemos las relaciones
Category.hasMany(Subcategory, {foreignKey: 'categoryId'})
Subcategory.belongsTo(Category, {foreignKey: 'categoryId'})


Subcategory.sync()
  .then(() => {
    console.log('Subcategory table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Subcategory
