const db = require('../database/config')
const Sequelize = require('sequelize')
const Reservation = require('./reservation.model')

const ReservationTImeDetail = db.define(
  'ReservationTImeDetail',
  {
    reservationId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      refrences: {
        model: Reservation,
        key: ['id']
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
    tableName: 'reservation_time_detail',
    timestamps: false
  } 
)

const packForeignKey = 'reservationId' 
// Creamos las relaciones entre modelos
Reservation.hasMany(ReservationTImeDetail, { foreignKey: packForeignKey })
ReservationTImeDetail.belongsTo(Reservation, { foreignKey: packForeignKey })

ReservationTImeDetail.sync()
  .then(() => {
    console.log('ReservationTImeDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationTImeDetail
