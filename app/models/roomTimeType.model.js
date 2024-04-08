const db = require('../database/config')
const Sequelize = require('sequelize')

const RoomTimeType = db.define(
  'RoomTimeType',
  {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'room_time_type',
    timestamps: false
  } 
)

RoomTimeType.sync()
  .then(() => {
    console.log('RoomTimeType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = RoomTimeType
