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
      references: {
        model: Reservation,
        key: 'id'
      }
    },
    itemId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: 'id'
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

// Creamos las relaciones entre modelos
const packForeignKey = 'reservationId' 
Reservation.hasMany(ReservationDetail, { foreignKey: packForeignKey })
ReservationDetail.belongsTo(Reservation, { foreignKey: packForeignKey })

const itemForeignKey = 'itemId' 
Item.hasMany(ReservationDetail, { foreignKey: itemForeignKey })
ReservationDetail.belongsTo(Item, { foreignKey: itemForeignKey })

ReservationDetail.sync()
  .then(() => {
    console.log('ReservationDetail table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationDetail
