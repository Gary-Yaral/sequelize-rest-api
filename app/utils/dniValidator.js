function validarCedula(cedula) {
  // Verificar que la cédula tenga 10 dígitos
  if (cedula.length !== 10) {
    return false
  }

  // Verificar que los primeros dos dígitos sean válidos
  const provincia = parseInt(cedula.substr(0, 2))

  if (provincia < 1 || provincia > 24) {
    return false
  }

  // Verificar el último dígito de la cédula usando el algoritmo de Módulo 10
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  const verificador = parseInt(cedula.charAt(9))
  let suma = 0

  for (let i = 0; i < 9; i++) {
    const digito = parseInt(cedula.charAt(i))
    let producto = digito * coeficientes[i]

    if (producto >= 10) {
      producto = producto - 9
    }

    suma += producto
  }

  // Calcular el dígito verificador esperado
  const verificadorEsperado = (10 - (suma % 10)) % 10
  // Comparar el dígito verificador esperado con el dígito verificador proporcionado
  return verificador === verificadorEsperado
}


module.exports = { validarCedula }