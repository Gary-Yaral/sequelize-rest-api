const db = require('../database/config')
const Sequelize = require('sequelize')

const UserStatus = db.define(
  'UserStatus',
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
    tableName: 'user_status',
    timestamps: false
  }
)
UserStatus.sync()
  .then(() => {
    console.log('UserStatus table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = UserStatus
