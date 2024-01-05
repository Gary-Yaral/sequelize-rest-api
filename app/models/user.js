const sequelize = require('../database/config');
const Sequelize = require('sequelize')

const User = sequelize.define('User', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: false
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    // Otros campos del modelo...
  }, 
  {tableName: 'user'} // Para que use el nombre correcto y no añada la S
);

User.sync()
.then(() => {
  console.log('Sincronizado a tabla usuario');
})
.catch((err) => {
  console.log(err);
})


module.exports = User