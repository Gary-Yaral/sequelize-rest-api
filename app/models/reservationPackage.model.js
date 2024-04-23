const db = require('../database/config')
const Sequelize = require('sequelize')
const Item = require('./item.model')
const Reservation = require('./reservation.model')

const ReservationPackage = db.define(
  'ReservationPackage',
  {
    reservationId:{
      type: Sequelize.STRING,
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
    tableName: 'reservation_package',
    timestamps: false
  } 
)

// Creamos las relaciones entre modelos
const packForeignKey = 'reservationId' 
Reservation.hasMany(ReservationPackage, { foreignKey: packForeignKey })
ReservationPackage.belongsTo(Reservation, { foreignKey: packForeignKey })

const itemForeignKey = 'itemId' 
Item.hasMany(ReservationPackage, { foreignKey: itemForeignKey })
ReservationPackage.belongsTo(Item, { foreignKey: itemForeignKey })

ReservationPackage.sync()
  .then(() => {
    console.log('ReservationPackage table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationPackage
