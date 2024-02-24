const customMessages = {
  // Mensajes para el campo 'dni'
  'required': 'Campo no fue enviado y es obligatorio.',
  'dni.valid': 'Cédula no es valida',
  'dni.repeated': 'Ya existe un usuario con ese número de cédula',
  'username.repeated': 'Nombre de usuario ya existe',
  'hardText.invalid': 'Campo debe tener al menos 8 caracteres, incluir una letra mayúscula, una minuscula, un número y un caracter especial',
  'empty': 'Campo fue enviado vacio',
  'email.invalid': 'Email no es válido', 
  'number.int': 'Debe ser un número entero',
  'telephone.length': 'Deben ser 10 números (Ejemplo: 06xxxxxxxx, 09xxxxxxxx)',
  'telephone.invalid': 'Telefono no es válido',
  'include.blanks': 'No se permiten espacios',
  'blanks': 'No se permite espacios en blanco al principio ni al final ni espacios dobles'
}

module.exports = { customMessages }