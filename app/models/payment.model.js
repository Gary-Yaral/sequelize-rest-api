const db = require('../database/config')
const Sequelize = require('sequelize')
const PaymentStatus = require('./paymentStatus.model')
const Reservation = require('./reservation.model')

const Payment = db.define(
  'Payment',
  {
    id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false, 
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    date:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    total:  {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    reservationId:  {
      type: Sequelize.STRING,
      allowNull: false
    },
    paymentStatusId:  {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    image:  {
      type: Sequelize.STRING,
      allowNull: true
    },
    publicId:  {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  { 
    tableName: 'payment',
    timestamps: false
  } 
)

// Establecemos las relaciones 
PaymentStatus.hasMany(Payment, {foreignKey: 'paymentStatusId'})
Payment.belongsTo(PaymentStatus, {foreignKey: 'paymentStatusId'})

Reservation.hasMany(Payment, {foreignKey: 'reservationId'})
Payment.belongsTo(Reservation, {foreignKey: 'reservationId'})


Payment.sync()
  .then(() => {
    console.log('Payment table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = Payment
