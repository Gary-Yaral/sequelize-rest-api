const User = require('../models/userModel')
const { validateDNI } = require('../utils/ecuadorianDni')

async function validateUserDNI(req, res, next) {
  if(!req.params.dni) {
    return res.status(404).json({error: true, msg:'Page not found'})
  }
  const { dni } = req.params
  if(!validateDNI(dni)) {
    return res.status(404).render('notFound')
  }
  const found = await User.findOne({ where: {dni}})
  if(!found) {
    return res.status(404).render('notFound')
  }
  req.body.found = found.dataValues
  next()
}

module.exports = { validateUserDNI }