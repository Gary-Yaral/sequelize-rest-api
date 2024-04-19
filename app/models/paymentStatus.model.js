const db = require('../database/config')
const Sequelize = require('sequelize')

const PaymentStatus = db.define(
  'PaymentStatus',
  {
    status:  {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  },
  { 
    tableName: 'payment_status',
    timestamps: false
  } 
)
PaymentStatus.sync()
  .then(() => {
    console.log('PaymentStatus table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = PaymentStatus
