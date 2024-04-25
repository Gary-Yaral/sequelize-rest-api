class Uploader {
  constructor() {

  }
  
  async upload() {
    throw Error('upload method must be implemented in uploader')
  }

  async delete() {
    throw Error('delete method must be implemented in uploader')
  }

  async setFolder() {
    throw Error('setFolder method must be implemented in uploader')
  }
}

module.exports = { Uploader }