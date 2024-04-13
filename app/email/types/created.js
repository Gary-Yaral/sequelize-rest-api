const { logo } = require('../constants')

let htmlInitial = (info) => `
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
        <h1 style="margin: 0; color: #333333;">Felicidades su reservación ha sido recibida</h1>
        <p style="margin: 10px 0; color: #666666;">En el trascurso del día se procederá a revisar su reservación y su posterior aprobación</p>
        <p style="margin: 10px 0; color: #666666;"><h3></h3></p>
        <p style="margin: 10px 0; color: #666666;">${info}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

module.exports = { htmlInitial }