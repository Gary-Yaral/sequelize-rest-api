const db = require('../database/config')
const Sequelize = require('sequelize')
const ReservationStatus = require('./reservationStatus.model')
const UserRole = require('./userRoleModel')
const Room = require('./room.model')
const { getCurrentDate } = require('../utils/functions')
const ScheduleType = require('./sheduleType.model')

const Reservation = db.define(
  'Reservation',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false, 
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    currentDate:  {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: getCurrentDate()
    },
    date:{
      type: Sequelize.STRING,
      allowNull: false
    },
    packageId:{
      type: Sequelize.INTEGER,
      allowNull: true
    },
    userRoleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserRole,
        key: 'id'
      }
    },
    roomId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: 'id'
      }
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ReservationStatus,
        key: 'id'
      }
    },
    scheduleTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: ScheduleType,
        key: 'id'
      }
    }
  },
  { 
    tableName: 'Reservation',
    timestamps: false
  } 
)


// Creamos las relaciones entre modelos
let foreignKeyResStatus = 'statusId'
ReservationStatus.hasMany(Reservation, { foreignKey: foreignKeyResStatus })
Reservation.belongsTo(ReservationStatus, { foreignKey: foreignKeyResStatus })

let foreignKeyUserRole = 'userRoleId'
UserRole.hasMany(Reservation, { foreignKey: foreignKeyUserRole })
Reservation.belongsTo(UserRole, { foreignKey: foreignKeyUserRole })

let foreignKeyRoom = 'roomId'
Room.hasMany(Reservation, { foreignKey: foreignKeyRoom })
Reservation.belongsTo(Room, { foreignKey: foreignKeyRoom })

let foreignScheduleType = 'scheduleTypeId'
ScheduleType.hasMany(Reservation, { foreignKey: foreignScheduleType })
Reservation.belongsTo(ScheduleType, { foreignKey: foreignScheduleType })

Reservation.sync()
  .then(() => {
    console.log('Reservation table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Reservation
