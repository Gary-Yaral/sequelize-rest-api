const db = require('../database/config')
const Sequelize = require('sequelize')

const UserStatus = db.define(
  'UserStatus',
  {
    name: {
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
