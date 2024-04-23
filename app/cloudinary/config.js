const cloudinary = require('cloudinary').v2
require('dotenv').config()

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// Ruta de la imagen que quieres subir
const folderPath = './app/images/'
const folderNameCloudinary = 'anis_app'

// Subir la imagen a Cloudinary
async function uploadImage(imgName, folderCloudinary = '') {
  const fullPath = folderPath + imgName
  if(folderCloudinary === '') {
    folderCloudinary = folderNameCloudinary
  }
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fullPath, { folder: folderCloudinary }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}  

async function deleteImageFromCloud(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { done: true }
  } catch (error) {
    return {error: true, msg: 'Error al eliminar imagen de la nube'}
  }

}

module.exports ={ uploadImage, deleteImageFromCloud}


