const { logo } = require('../constants')

let htmlSuccess = (info, accounts = [], endpoint = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <table style="width: 100%; max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="text-align: center; padding-bottom: 10px;">
        <img src="${logo}" alt="Logotipo" style="max-width: 200px;">
      </td>
    </tr>
    <tr>
      <td style="text-align: center; background-color: #ffffff; padding: 10px">
        <h1 style="margin: 0; color: #15E765;">!Reservación ha sido aceptada</h1>
        <p style="margin: 10px 0; color: #666666;"><h3>Datos de la reserva</h3></p>
        <p style="margin: 10px 0; color: #666666;">${info}</p>
        <h3 style="margin: 10px 0; color:#333333;">Puede realizar el pago en los siguiente números de cuenta</h3>
        <p style="margin: 10px 0; color: #666666;">
          ${concatAccountstoPay(accounts)}
        </p>
        <p>Para cargar el comprobante de pago de la reservación, lo puedes hacer en el siguiente enlace: <a href="${endpoint}">Enviar comprobante</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
function concatAccountstoPay(accounts) {
  var str = ''
  accounts.forEach((data) => {
    str += `<b>${data.bank} - ${data.account} - ${data.type}</b></br>`
  })
  return str
}

module.exports = { htmlSuccess }