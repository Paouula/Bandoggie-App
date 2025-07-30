import nodemailer from "nodemailer";
import { config } from "../config.js";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.email.email_user,
        pass: config.email.email_pass
    }
});


const sendMail = async (to, subject, text, html) => {
    try {

        const info = await transporter.sendMail({
            from: '"Bandoggie" <ricardo.mayorga.ck@gmail.com>',
            to,
            subject,
            text,
            html
        });
        return info;
    } catch (error) {
        console.log("Error sending recovery mail:", error);
        throw error;
    }
};


const HTMLRecoveryEmail = (code) => {
    return `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Recuperación de Contraseña - Bandoggie</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2&family=Raleway:wght@400;600&display=swap');

    body {
      font-family: 'Baloo Bhaijaan 2', 'Raleway', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f6f9fc;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fffdfa;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 2px solid #ffb300;
    }

    .header {
      background: linear-gradient(90deg, #ffb300 0%, #ff9800 100%);
      color: #222;
      text-align: center;
      padding: 24px 0 12px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .content {
      padding: 28px 32px 16px;
    }

    .greeting {
      font-size: 18px;
      font-weight: bold;
      color: #ff9800;
      margin-bottom: 18px;
    }

    p {
      font-size: 15px;
      margin-bottom: 16px;
      color: #4a4a4a;
    }

    .code-box {
      margin: 24px auto;
      padding: 16px 0;
      background: #fff3cd;
      color: #ff9800;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      border-radius: 10px;
      border: 1.5px dashed #ffb300;
      width: 220px;
      letter-spacing: 6px;
    }

    .note {
      background-color: #fffde7;
      border-left: 4px solid #ffd54f;
      border-radius: 8px;
      padding: 15px;
      font-size: 14px;
      color: #5d4037;
    }

    .button-container {
      text-align: center;
      margin: 25px 0;
    }

    .button {
      background: #ffb300;
      color: white;
      padding: 10px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(255, 179, 0, 0.2);
      display: inline-block;
      transition: all 0.3s ease;
    }

    .button:hover {
      background-color: #ffa000;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 20px;
      background-color: #f6f9fc;
      border-top: 1px solid #ffe082;
    }

    .footer small {
      display: block;
      margin-top: 10px;
      font-size: 11px;
    }

    @media only screen and (max-width: 600px) {
      .container {
        border-radius: 0;
        margin: 0;
      }

      .code-box {
        font-size: 24px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      🐾 Bandoggie - Recuperación de Contraseña
    </div>

    <div class="content">
      <div class="greeting">¡Hola!</div>
      <p>Recibimos una solicitud para recuperar la contraseña de tu cuenta en <b>Bandoggie</b>.</p>
      <p>Por seguridad, usa el siguiente código para continuar con el proceso:</p>

      <div class="code-box">${code}</div>

      <p>Este código es válido por <b>30 minutos</b>. Si no solicitaste esta acción, puedes ignorar este mensaje.</p>

      <div class="note">
        💡 Importante: Ingresa este código en la sección de recuperación de contraseña dentro de nuestra app.
      </div>

    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Bandoggie. Todos los derechos reservados.</p>
      <small>Este es un mensaje automático. Por favor, no respondas a este correo.</small>
      <small>Bandoggie Inc. | San Salvador, El Salvador | NIT: 0614-290523-102-1</small>
    </div>
  </div>
</body>
</html>

    `;
};

export { sendMail, HTMLRecoveryEmail };