function validateDNI(dni) {
  // Verificar que la cédula tenga 10 dígitos
  if (dni.length !== 10) {
    return false
  }

  // Verificar que los primeros dos dígitos sean válidos
  const province = parseInt(dni.substr(0, 2))

  if (province < 1 || province > 24) {
    return false
  }

  // Verificar el último dígito de la cédula usando el algoritmo de Módulo 10
  const coefficient = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  const validator = parseInt(dni.charAt(9))
  let sum = 0

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(dni.charAt(i))
    let product = digit * coefficient[i]

    if (product >= 10) {
      product = product - 9
    }

    sum += product
  }

  // Calcular el dígito validator esperado
  const expectedValidator = (10 - (sum % 10)) % 10
  // Comparar el dígito validator esperado con el dígito validator proporcionado
  return validator === expectedValidator
}

module.exports = { validateDNI }