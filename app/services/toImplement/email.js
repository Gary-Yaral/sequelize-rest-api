class Email {
  async send() {
    throw Error('Send method must be implemented')
  }
}

module.exports = { Email }