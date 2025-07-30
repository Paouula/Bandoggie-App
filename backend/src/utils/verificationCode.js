import nodemailer from 'nodemailer'
import { config } from '../config.js'

const sendVerificationEmail = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.email_user,
            pass: config.email.email_pass
        }
    })

    const mailOptions = {
        from: config.email.email_user,
        to: email,
        subject: "Verificación de correo - Bandoggie",
        html: `
            <div style="max-width: 500px; margin: 32px auto; background: #fffdfa; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); border: 2px solid #ffb300; font-family: 'Baloo Bhaijaan 2', Arial, sans-serif; overflow: hidden;">
  <!-- Encabezado -->
  <div style="background: linear-gradient(90deg, #ffb300 0%, #ff9800 100%); color: #222; text-align: center; padding: 24px 0 12px; font-size: 26px; font-weight: bold; letter-spacing: 1px;">
    🐾 Bandoggie - Verifica tu correo
  </div>

  <!-- Cuerpo -->
  <div style="padding: 28px 32px 20px; color: #333; font-size: 16px; line-height: 1.6;">
    <p style="margin-bottom: 18px;">¡Hola!</p>

    <p style="margin-bottom: 18px;">
      Gracias por registrarte en <b>Bandoggie</b>. Para completar tu registro, por favor introduce el siguiente código de verificación en la plataforma:
    </p>

    <!-- Código -->
    <div style="margin: 24px auto; padding: 16px 0; background: #fff3cd; color: #ff9800; font-size: 32px; font-weight: bold; text-align: center; border-radius: 10px; border: 1.5px dashed #ffb300; width: 220px; letter-spacing: 6px;">
      ${verificationCode}
    </div>

    <p style="margin-bottom: 18px;">
      Este código es válido por <b>2 horas</b>. Después de eso, deberás solicitar uno nuevo si no lo has usado.
    </p>

    <!-- Botón -->
    

    <!-- Aviso -->
    <p style="margin-top: 28px; color: #888; font-size: 14px; text-align: center;">
      Si no solicitaste este correo, puedes ignorarlo de forma segura.
    </p>
  </div>

  <!-- Pie -->
  <div style="background: #ffb300; text-align: center; padding: 10px; font-size: 14px; color: #fff; border-top: 1px solid #ffe082;">
    🐶 Bandoggie - ¡Cuidamos a tus mejores amigos!
  </div>
</div>

        `
    }


    return transporter.sendMail(mailOptions)
}

export default sendVerificationEmail
