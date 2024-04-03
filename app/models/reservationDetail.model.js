const db = require('../database/config')
const Sequelize = require('sequelize')
const Item = require('./item.model')
const Reservation = require('./reservation.model')

const ReservationDetail = db.define(
  'ReservationDetail',
  {
    reservationId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      refrences: {
        model: Reservation,
        key: ['id']
      }
    },
    itemId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      refrences: {
        model: Item,
        key: ['id']
      }
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    quantity: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  },
  { 
    tableName: 'reservation_detail',
    timestamps: false
  } 
)

const packForeignKey = 'reservationId' 
// Creamos las relaciones entre modelos
Reservation.hasMany(ReservationDetail, { foreignKey: packForeignKey })
ReservationDetail.belongsTo(Reservation, { foreignKey: packForeignKey })

ReservationDetail.sync()
  .then(() => {
    console.log('ReservationDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationDetail
