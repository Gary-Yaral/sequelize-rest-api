const fs = require('fs')
const path = require('path')
class CleanFolderService {
  path
  constructor(pathFolder) {
    this.path = pathFolder
  }

  clear() {
    try {
      fs.readdirSync(this.path).forEach(name => {
        fs.unlinkSync(path.join(this.path, name))
      })
      return {done: true, msg: 'Se ha limpiado la carpeta de imagenes', files: fs.readdirSync(path)}
    } catch (error) {
      console.log(error)
      return {error: true, msg: 'Error al limpiar la carpeta de imagenes'}
    }
  }
}

module.exports = { CleanFolderService }