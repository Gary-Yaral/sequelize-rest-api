const { logo } = require('../constants')

let htmlDenied = (info) => `
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
        <h1 style="margin: 0; color: #F70303;">!Reservación ha sido rechazada!</h1>
        <p style="margin: 10px 0; color: #666666;">Para más información al respecto, comuniquese con el administrador</p>
        <p style="margin: 10px 0; color: #666666;"><h3>Datos de la reserva</h3></p>
        <p style="margin: 10px 0; color: #666666;">${info}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

module.exports = { htmlDenied }