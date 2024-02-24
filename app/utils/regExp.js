const hardTextRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;"'<>?,./])\S{8,}$/
const telephoneRegex = /^0[1-9]\d{8}$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const textRegex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚ,_-]+( [a-zA-Z0-9áéíóúñÁÉÍÓÚ,_-]+)*$/
module.exports = {
  hardTextRegex,
  telephoneRegex,
  emailRegex,
  textRegex
}