const { getErrorFormat } = require('../utils/errorsFormat')

function findId(model, find = {prop: 'id'}) {
  return async function(req, res, next){
    try {
      let errorName = find.prop
      if(!req.params[find.prop]) {
        let errors = {...getErrorFormat(errorName, `No se ha recibido el ${find.prop}`, 'params')}
        let errorKeys = [errorName]
        res.status(400).json({ errors, errorKeys })
      }
      const found = await model.findByPk(req.params[find.prop])
      if(!found) {
        let errors = {...getErrorFormat(errorName, 'No existe un registro con ese identificador', 'params')}
        let errorKeys = [errorName]
        res.status(400).json({ errors, errorKeys })
      }
      req.body.found = found
      next()
    } catch (error) {
      let errorName = 'request'
      let errors = {...getErrorFormat(errorName, 'Error en la petición', errorName)}
      let errorKeys = [errorName]
      res.status(400).json({ errors, errorKeys })
    }
  }
}



module.exports = { findId }