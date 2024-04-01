const sequelize = require('../database/config')
const { Op, where, col, cast} = require('sequelize')
const Room = require('../models/room.model')
const { deteleImage } = require('../utils/deleteFile')

async function add(req, res) {
  const transaction = await sequelize.transaction()
  try {
    const user = await Room.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios en la base de datos
    if(user.id) {
      await transaction.commit() 
      return res.json({
        done: true,
        msg: 'Local agregado correctamente'
      })
    }
    // SI NO SE INSERTÓ EL REGISTRO
    // eliminamos la imagen que guardamos
    const hasError = deteleImage(req.body.image) 
    // Si no se pudo eliminar la imagen que guardamos devolvemos error
    if(hasError) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar imagen guardada previamente' })
    }
    // Una vez eliminada la imagen deshacemos los cambios y devolvemos error
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar el local' })
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al guardar datos del local' })
  }
}

async function update(req, res) {
  const transaction = await sequelize.transaction()
  try { 
    // Si no se envio una imagen la quitamos del body para que no actualice la imagen
    if(req.body.image === '' || !req.body.image) {
      delete req.body.image
    }
    // Actualizamos los datos
    await Room.update(req.body, {where: {id: req.params.id}}, {transaction})
    // Eliminamos la imagen anterior usando su path
    if(req.body.found.image) {
      const hasError = deteleImage(req.body.found.image)  
      // Si no se pudo eliminar la imagen que guardamos devolvemos error
      if(hasError) {
        await transaction.rollback()
        return res.json({ error: true, msg: 'Error al eliminar imagenes anteriores' })
      }
    }
    // Retornamos el mensaje de que todo ha ido bien
    await transaction.commit() 
    return res.json({
      done: true,
      msg: 'Registro actualizado correctamente'
    })
    
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al actualizar datos del local' })
  }
}

async function remove(req, res) {
  const transaction = await sequelize.transaction()
  try {
    //Extraemos el id de registro encontrado
    const { id, image } = req.body.found
    // si existe lo eliminamos
    const affectedRows = await Room.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar local'})
    }
    // Si todo ha ido bien
    const hasError = deteleImage(image)
    if(hasError) {
      await transaction.rollback()
      return res.json({ error: true, msg: 'Error al eliminar las imagenes del local' })
    }
    // Guardamos los cambios en la base de datos
    await transaction.commit()
    // Retornamos mensjae de que todo ha ido bien
    return res.json({
      done: true,
      msg: 'Local eliminado correctamente'
    })
  } catch (error) {
    await transaction.rollback()
    return res.json({ error: true, msg: 'Error al intentar eliminar el local' })
  }
}

async function paginate(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage)
    const perPage = parseInt(req.query.perPage)
    const data = await Room.findAndCountAll({
      limit: perPage,
      offset: (currentPage - 1) * perPage
    })
    return res.json({ result: true, data })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al paginar los locales' })
  }
}

async function filterAndPaginate(req, res) {
  try {
    const filter = req.body.filter
    // Parseamos los valores a números
    const currentPage = parseInt(req.body.currentPage)
    const perPage = parseInt(req.body.perPage)

    // Construir la condición de filtro
    const filterCondition = {
      limit: perPage,
      offset: (currentPage - 1) * perPage,
      raw: true,
      where: {
        [Op.or]: [
          where(
            cast(col('rent'), 'CHAR'), {[Op.like]: `%${filter}%`}
          ),
          { name: { [Op.like]: `%${filter}%` } },
          { address: { [Op.like]: `%${filter}%` } },
          { telephone: { [Op.like]: `%${filter}%` } },
          { email: { [Op.like]: `%${filter}%` } }
        ]
      }
    }
    // Realizar la consulta con paginación y filtros
    const data = await Room.findAndCountAll(filterCondition)
    return res.json({ result: true, data }) 
  } catch(error) {
    console.log(error)
    return res.json({ error: true, msg: 'Error al filtrar y paginar los locales' })
  }
}

async function getAll(req, res) {
  try {
    const rooms = await Room.findAll()
    return res.json({ data: rooms })
  } catch (error) {
    return res.json({ error: true, msg: 'Error al listar todos los locales' })
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll,
  paginate, 
  filterAndPaginate
}