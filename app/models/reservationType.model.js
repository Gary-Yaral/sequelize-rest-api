const db = require('../database/config')
const Sequelize = require('sequelize')
const Room = require('./room.model')
const ScheduleType = require('./sheduleType.model')

const ReservationType = db.define(
  'ReservationType',
  {
    scheduleTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ScheduleType,
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
    tableName: 'reservation_Type',
    timestamps: false
  } 
)

// Creamos las relaciones
let foreignKey = 'roomId'
Room.hasMany(ReservationType, {foreignKey})
ReservationType.belongsTo(Room, {foreignKey})

foreignKey = 'scheduleTypeId'
ScheduleType.hasMany(ReservationType, {foreignKey})
ReservationType.belongsTo(ScheduleType, {foreignKey})

ReservationType.sync()
  .then(() => {
    console.log('ReservationType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationType
