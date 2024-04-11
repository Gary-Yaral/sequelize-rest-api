const db = require('../database/config')
const Sequelize = require('sequelize')
const Reservation = require('./reservation.model')

const ReservationSchedule = db.define(
  'ReservationSchedule',
  {
    reservationId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Reservation,
        key: 'id'
      }
    },
    initialTime:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    finalTime:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  },
  { 
    tableName: 'reservation_schedule',
    timestamps: false,
    as: 'ReservationSchedule'
  } 
)

const packForeignKey = 'reservationId' 
// Creamos las relaciones entre modelos
Reservation.hasMany(ReservationSchedule, { foreignKey: packForeignKey })
ReservationSchedule.belongsTo(Reservation, { foreignKey: packForeignKey })

ReservationSchedule.sync()
  .then(() => {
    console.log('ReservationSchedule table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationSchedule
