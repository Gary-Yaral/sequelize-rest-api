const db = require('../database/config')
const Sequelize = require('sequelize')
const Reservation = require('./reservation.model')

const ReservationSchedules = db.define(
  'ReservationSchedules',
  {
    reservationId:{
      type: Sequelize.STRING,
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
    timestamps: false
  } 
)

const packForeignKey = 'reservationId' 
// Creamos las relaciones entre modelos
Reservation.hasMany(ReservationSchedules, { foreignKey: packForeignKey })
ReservationSchedules.belongsTo(Reservation, { foreignKey: packForeignKey })

ReservationSchedules.sync()
  .then(() => {
    console.log('ReservationSchedules table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationSchedules
