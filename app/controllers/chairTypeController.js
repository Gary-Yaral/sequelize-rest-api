const sequelize = require('../database/config')
const ChairType = require('../models/chairTypeModel')
const { wasReceivedAllProps } = require('../utils/propsValidator')
const { saveImage, newImageName } = require('../utils/saveImage')

const requiredProps = ['type', 'price', 'description', 'image']

async function add(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, requiredProps)){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    // Guardamos la imagen que nos enviaron
    const savedImage = saveImage(req.body.image, newImageName('ChairType').filename)
    // si no se pudo guardar la imagen devolvemos error y no guardamos el registro
    if(savedImage.error) {
      return res.status(401)
        .json({ 
          error: savedImage.error, 
        })
    }
    //Reemplazamos el base64 por por el nuevo nombre de la imagen
    req.body.image = savedImage.filename
    // Guardamos el registro
    const user = await ChairType.create(req.body, {transaction})
    // Si todo salio bien se guardan cambios
    if(user.id) {
      await transaction.commit() 
      return res.json({
        result: true,
        message: 'Tipo de Silla registrado correctamente'
      })
    }
    // Si no se guardaron los dos
    await transaction.rollback()
    return res.json({
      result: false,
      message: 'No se pudo registrar el tipo de silla'
    })
  } catch (error) {
    res.status(500).json({message: 'Error al crear tipo de silla', error})
  }
}

async function update(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!wasReceivedAllProps(req, [...requiredProps]) || !req.params.id){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    // Extraemos los campos
    const attrs = Object.keys(req.body)
    attrs.forEach(prop => {
      if(req.body[prop] === '') {
        delete req.body[prop]
      }
    })

    // REVISAR SI FUE ENVIADA UNA IMAGEN NUEVA Y SI FUE ENVIADA ENTONCES VERIFICAR SI HAY
    //REGISTROS VINCULADOS CON ESA IMAGEN QUE YA TENIA GUARDADA

    // Actualizamos los datos
    const [updatedRows] = await ChairType.update(req.body, {where: {id: req.params.id}}, {transaction})

    // Devolvemos error en caso de que no hubo cambios
    if(updatedRows === 0) {
      // Si no se pudo guardar
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'No se realizó cambios. Los datos recibidos son similares a los registrados'
      })
    }

    await transaction.commit() 
    return res.json({
      result: true,
      message: 'Tipo de silla actualizado correctamente'
    })
   
  } catch (error) {
    res.status(500).json({message: 'Error al actualizar tipo de silla', error})
  }
}

async function remove(req, res) {
  try {
    const transaction = await sequelize.transaction()
    if(!req.params.id){
      return res.status(401)
        .json({ 
          error: 'No se han recibido todos los campos', 
        })
    }

    // Extraemos los campos
    if(req.params.id === '') {
      return res.status(401)
        .json({ 
          error: 'No se ha enviado el id del registro', 
        })
    }
    // Buscamos el registro a eliminar
    const toDelete = await ChairType.findByPk(req.params.id, {transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(!toDelete) {
      return res.json({
        result: false,
        message: 'Tipo de silla no existe en el sistema'
      })
    }
    //Extraemos el id de registro encontrado
    const { id } = toDelete.dataValues
    // si existe lo eliminamos
    const affectedRows = await ChairType.destroy({ where: { id }, transaction})
    // Si no lo encontramos devolvemos meensaje de error
    if(affectedRows === 0) {
      await transaction.rollback()
      return res.json({
        result: false,
        message: 'Tipo de silla no se pudo eliminar del sistema'
      })
    }
    // Si todo ha ido bien
    await transaction.commit()
    return res.json({
      result: true,
      message: 'Tipo de silla eliminado correctamente'
    })
  } catch (error) {
    res.status(500).json({message: 'Error al eliminar tipo de silla', error})
  }
}

async function getAll(req, res) {
  try {
    const all = await ChairType.findAll()   
    return res.json({
      result: true,
      data: all
    })
  } catch (error) {
    res.status(500).json({message: 'Error al consultar los datos', error})
  }
}

module.exports = {
  add,
  update,
  remove,
  getAll
}