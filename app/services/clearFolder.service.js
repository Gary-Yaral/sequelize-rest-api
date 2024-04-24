const fs = require('fs')
const path = require('path')
class CleanFolderService {
  path = null
  constructor(pathFolder) {
    this.path = pathFolder
  }

  clear() {
    try {
      const files = fs.readdirSync(this.path)
      if(files.length > 0) {
        files.forEach(name => {
          fs.unlinkSync(path.join(this.path, name))
        })
      }
      return {done: true, msg: 'Se ha limpiado la carpeta de imagenes', files: fs.readdirSync(this.path)}
    } catch (error) {
      console.log(error)
      return {error: true, msg: 'Error al limpiar la carpeta de imagenes'}
    }
  }
}

module.exports = { CleanFolderService }