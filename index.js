require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
const path = require('path')
const app = express()
const socketIo = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketIo(server)
const cors = require('cors')
const PORT = process.env.PORT || 4000 

app.use(cors({
  origin: 'http://localhost:4200', 
  optionsSuccessStatus: 200
}))
app.set('view engine', 'ejs')
app.set('io', io)
app.set('views', path.join(__dirname, 'app', 'views'))
app.use(express.json())
app.use('/api/images', express.static(path.join(__dirname, 'app' ,'images')))
app.use('/api', routes.router)
// Middleware para servir archivos estáticos desde la carpeta 'imagenes'

sequelize.sync()
  .then(() => {
    io.on('connection', (socket) => {
      console.log('Cliente conectado')
  
      // Maneja el evento de desconexión de los clientes
      socket.on('disconnect', () => {
        console.log('Cliente desconectado')
      })
    })
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    console.log('Database have been synchronized')
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })
