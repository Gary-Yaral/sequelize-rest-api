const { QueryTypes } = require('sequelize')
const db = require('../database/config')

async function getHomeData(req, res) {
  try {
    let query = `
      SELECT 
        COUNT(*) AS reservations,
        (SELECT COUNT(*) AS rooms FROM room) AS rooms,
        (SELECT COUNT(*) AS items FROM item) AS items,
        (SELECT COUNT(*) AS roles FROM user_roles) AS users
      FROM reservation 
    ` 
    let data = await db.query(query, {type: QueryTypes.SELECT})
    return res.json({data})
  } catch (error) {
    console.log(error)
    return res.json({error: true, msg: 'Error al cargar los datos del home'})
  }
}

module.exports = {getHomeData}