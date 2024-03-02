const fs = require('fs')
const router = require('express').Router()

const files = fs.readdirSync(__dirname)
// Archivos que no convertiremos a rutas
const skiped = ['index']
// Rutas que tendran cada archivo
const routes = {
  'user': 'users',
  'userAdmin': 'admin',
  'userRole': 'roles',
  'chairType': 'chairs',
  'tableType': 'tables',
  'drinkType': 'drink-types',
  'dishType': 'dish-types',
  'decorationType': 'decorations',
  'images': 'images',
  'token': 'token',
  'userStatus': 'status',
  'role': 'role'
}

// Enrutador de cada archivo
files.forEach((file) => {
  let routeName = file.split('.')[0]
  if(!skiped.includes(routeName)) {
    router.use(`/${routes[routeName]}`, require(`./${routeName}`).router)
  }
})

// Mensaje de error si la ruta no existe
router.use('/*', (req, res) => {
  res.status(404)
  res.send({error: 'Error: URL not found'})
})

module.exports = { router }