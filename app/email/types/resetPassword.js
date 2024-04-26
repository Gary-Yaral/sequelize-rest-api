const { logo } = require('../constants')

let resetPasswordEmail = (link) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
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
        <h1 style="margin: 0; color: #003AD8;">Restablecer contraseña</h1>
        <p style="margin: 10px 0; color: #666666;"><b>Ha solicitado restablecer contraseña</b></p>
        <p style="margin: 10px 0; color: #666666;"><b>Deseo <a href="${link}">restablecer</a> mi contraseña</p>
      </td>
    </tr>
  </table>
</body>
</html>
`

module.exports = { resetPasswordEmail }