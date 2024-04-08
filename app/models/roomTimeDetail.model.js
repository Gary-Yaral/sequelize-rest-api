const db = require('../database/config')
const Sequelize = require('sequelize')
const Room = require('./room.model')
const RoomTimeType = require('./roomTimeType.model')

const RoomTimeDetail = db.define(
  'RoomTimeDetail',
  {
    timeType: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: RoomTimeType,
        key: 'id'
      }
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: 'id'
      }
    }
  },
  { 
    tableName: 'room_time_detail',
    timestamps: false
  } 
)

// Creamos las relaciones
let foreignKey = 'roomId'
Room.hasMany(RoomTimeDetail, {foreignKey})
RoomTimeDetail.belongsTo(Room, {foreignKey})

foreignKey = 'timeType'
RoomTimeType.hasMany(RoomTimeDetail, {foreignKey})
RoomTimeDetail.belongsTo(RoomTimeType, {foreignKey})

RoomTimeDetail.sync()
  .then(() => {
    console.log('RoomTimeDetail table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = RoomTimeDetail
