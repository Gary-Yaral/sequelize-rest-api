require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
/* const { generateHash } = require('./app/utils/bcrypt') */
const app = express()
const PORT = process.env.PORT || 4000 

/* generateHash('Holamundo_2023').then((res) =>{ console.log(res)}) */

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
