const User = require('../models/userModel')

async function verifyUserExistsToResetPassword(req, res, next) {
  const { username, email } = req.body
  const found = await User.findOne({ where: { username, email }})
  if(!found) {
    return res.json({error: true, msg: 'Usuario o email incorrectos'})
  }
  req.body.found = found.dataValues
  next()
}

module.exports = { verifyUserExistsToResetPassword }