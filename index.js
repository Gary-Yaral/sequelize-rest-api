require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use('/api', routes.router)

sequelize.sync()
  .then(() => {
    app.listen(PORT)
    console.log('Database have been synchronized')
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
