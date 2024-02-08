require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
const path = require('path')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 4000 

app.use(cors({
  origin: '*'
}))
app.use(express.json())
app.use('/api/images', express.static(path.join(__dirname, 'app' ,'images')))
app.use('/api', routes.router)
// Middleware para servir archivos estáticos desde la carpeta 'imagenes'

sequelize.sync()
  .then(() => {
    app.listen(PORT)
    console.log('Database have been synchronized')
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
