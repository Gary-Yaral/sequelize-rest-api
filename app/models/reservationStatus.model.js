const db = require('../database/config')
const Sequelize = require('sequelize')

const ReservationStatus = db.define(
  'ReservationStatus',
  {
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  { 
    tableName: 'reservation_status',
    timestamps: false
  } 
)

ReservationStatus.sync()
  .then(() => {
    console.log('ReservationStatus table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ReservationStatus
