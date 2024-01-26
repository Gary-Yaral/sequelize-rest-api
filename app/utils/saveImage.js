const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

function saveImage(base64Image, filename) {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+base64,/, '')
    // Convertir la cadena base64 a Buffer
    const buffer = Buffer.from(base64Data, 'base64')
    // Escribir el Buffer en un archivo
    const filePath = `./app/images/${filename}` // Corregir la ruta
    fs.writeFileSync(filePath, buffer)
    return { filePath, filename }
  } catch (error) {
    console.error('Error al guardar la imagen:', error)
    return { error }
  }
}


function newImageName(tablename) {
  const uniqueId = uuidv4()
  const now = Date.now()
  const filename = `${tablename}-${now}-${uniqueId}.jpg`
  return { filename }
}

module.exports = { saveImage, newImageName }
