const db = require('../database/config')
const Sequelize = require('sequelize')

const Role = db.define(
  'Role',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    rol: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  { 
    tableName: 'role',
    timestamps: false
  } 
)

Role.sync()
  .then(() => {
    console.log('Roles table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Role
