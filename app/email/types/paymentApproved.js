const { logo } = require('../constants')

let paymentApprovedMsg = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pago Aprobado</title>
  <link rel="icon" href="${logo}" type="image/png">
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
        <h1 style="margin: 0; color: rgb(0, 153, 255);">Felicidades su pago fué aprobado</h1>
        <p>Se procederá a realizar los preparativos de su reservación</p>
        <h3>!Gracias por preferirnos!</h3>
      </td>
    </tr>
  </table>
</body>
</html>
`

module.exports = { paymentApprovedMsg }