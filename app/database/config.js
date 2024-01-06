const Sequelize = require('sequelize')

const sequelize = new Sequelize('bdseguros','root','',{
  host: 'localhost',
  dialect: 'mysql'
})

sequelize.authenticate()
  .then(() =>{
    console.log('Logged')
  })

module.exports = sequelize