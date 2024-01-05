require('dotenv').config()
const express = require('express')
const sequelize = require('./app/database/config')
const routes = require('./app/routes/index')
const { createToken } = require('./app/utils/jwt')
const app = express()

console.log(createToken({name: 'Gary'}))

app.use(express.json())
app.use('/api', routes.router)
const PORT = process.env.PORT || 4000
console.log(PORT);

sequelize.sync()
.then(() => {
  app.listen(PORT)
  console.log('Database is conected');
})
.catch((err) => {
  console.log(`Error: ${err}`);
})
