const db = require('../database/config')
const Sequelize = require('sequelize')

const ScheduleType = db.define(
  'ScheduleType',
  {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  { 
    tableName: 'schedule_type',
    timestamps: false
  } 
)

ScheduleType.sync()
  .then(() => {
    console.log('ScheduleType table have been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = ScheduleType
