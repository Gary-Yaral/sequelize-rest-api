const fs = require('fs')
const path = require('path')


function deteleImage(imageName) {
  try {
    const folderPath = __dirname + '/../images/'
    const pathFile = path.join(folderPath, imageName)
    // Verificar si el archivo existe antes de intentar eliminarlo
    if (fs.existsSync(pathFile)) {
      // Eliminar el archivo
      fs.unlink(pathFile, (error) => {
        if (error) {
          return {
            error: true,
            message: `Error: ${error}`,
            pathImage: imageName
          }
        }
      })      
    } else {
      return {
        error: true,
        message: 'No existe la imagen: ' + imageName,
        pathImage: imageName
      }
    }
  } catch(error) {
    return {
      error: true,
      message: error,
      pathImage: imageName
    }
  }
}

module.exports = { 
  deteleImage
}