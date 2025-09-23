import nodemailer from "nodemailer";
import { config } from "../config.js";

// CREAR EL TRANSPORTER IGUAL QUE EN passwordRecovery.js - CORREGIDO
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.email.email_user,
        pass: config.email.email_pass
    }
});

// FUNCIÓN CORREGIDA PARA ENVIAR EMAIL
export const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"BanDoggie" <' + config.email.email_user + '>',
            to,
            subject,
            text,
            html
        });
        return info;
    } catch (error) {
        console.log("Error sending banking email:", error);
        throw error;
    }
};

// FUNCIÓN PARA GENERAR EL HTML DEL EMAIL BANCARIO - ACTUALIZADA
export const HTMLSimpleBankingEmail = (customerName, totalAmount, orderNumber = null) => {
    // Validar parámetros
    if (!customerName || !totalAmount) {
        throw new Error('customerName y totalAmount son requeridos para generar el email');
    }

    // Formatear el monto
    const formattedAmount = parseFloat(totalAmount).toFixed(2);
    
    // Usar la referencia corta proporcionada desde el frontend
    const reference = orderNumber || `REF${Date.now().toString().slice(-6)}`;

    // TEMPLATE ACTUALIZADO CON LA REFERENCIA CORTA
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Datos para Transferencia - BanDoggie</title>
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
            border: 2px solid #D2691E;
        }

        .header {
            background: linear-gradient(90deg, #D2691E 0%, #FF8C00 100%);
            color: white;
            text-align: center;
            padding: 24px 0 12px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .paw-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }

        .content {
            padding: 28px 32px 16px;
        }

        .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #D2691E;
            margin-bottom: 18px;
        }

        p {
            font-size: 16px;
            margin-bottom: 16px;
            color: #4a4a4a;
            line-height: 1.6;
        }

        .amount-box {
            margin: 24px auto;
            padding: 20px;
            background: linear-gradient(135deg, #D2691E, #FF8C00);
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            border-radius: 12px;
            width: 100%;
            box-sizing: border-box;
        }

        .banking-details {
            background-color: #f8f9fa;
            border: 3px solid #D2691E;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
        }

        .banking-title {
            color: #D2691E;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #D2691E;
            padding-bottom: 10px;
        }

        .bank-info {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
        }

        .bank-info-cell {
            flex: 1;
            min-width: calc(50% - 7.5px);
            padding: 15px;
            background-color: white;
            border: 2px solid rgba(210, 105, 30, 0.3);
            border-radius: 8px;
            text-align: center;
        }

        .bank-info-cell.highlighted {
            background-color: #fff3e0;
            border: 3px solid #D2691E;
        }

        .bank-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .bank-label {
            font-weight: 600;
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .bank-value {
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }

        .bank-value.account {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            color: #D2691E;
            letter-spacing: 1px;
        }

        .reference-box {
            background-color: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }

        .reference-label {
            font-size: 14px;
            color: #1976d2;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .reference-value {
            font-size: 22px;
            font-weight: bold;
            color: #0d47a1;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }

        .instructions {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }

        .instructions-title {
            color: #856404;
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 18px;
            text-align: center;
            border-bottom: 1px solid #ffc107;
            padding-bottom: 8px;
        }

        .instruction-item {
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            color: #856404;
            font-size: 14px;
            line-height: 1.4;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .instruction-icon {
            font-size: 16px;
            margin-top: 1px;
            flex-shrink: 0;
        }

        .security-note {
            background-color: #d1ecf1;
            border: 2px solid #bee5eb;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #0c5460;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
            background-color: #f8f9fa;
            border-top: 3px solid #D2691E;
        }

        .footer p {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .footer small {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            color: #999;
            line-height: 1.4;
        }

        @media only screen and (max-width: 600px) {
            .container {
                border-radius: 0;
                margin: 0;
            }
            
            .bank-info {
                flex-direction: column;
            }
            
            .bank-info-cell {
                min-width: 100%;
            }

            .reference-value {
                font-size: 20px;
                letter-spacing: 1px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="paw-icon">🐾</div>
            BanDoggie
            <div style="font-size: 14px; opacity: 0.9; margin-top: 8px;">Cuidamos a tu mejor amigo</div>
        </div>

        <div class="content">
            <div class="greeting">¡Hola ${customerName}!</div>
            
            <p>Gracias por tu compra en BanDoggie. Hemos recibido tu pedido y estamos emocionados de poder ayudar a cuidar a tu mascota.</p>

            <div class="amount-box">
                💰 Monto a transferir: $${formattedAmount}
            </div>

            <div class="banking-details">
                <div class="banking-title">
                     Datos para transferencia bancaria
                </div>
                
                <div class="bank-info">
                    <div class="bank-info-cell">
                        <div class="bank-label">BANCO</div>
                        <div class="bank-value">Banco Agrícola</div>
                    </div>
                    <div class="bank-info-cell">
                        <div class="bank-label">TIPO DE CUENTA</div>
                        <div class="bank-value">Cuenta de Ahorro</div>
                    </div>
                </div>
                
                <div class="bank-info">
                    <div class="bank-info-cell highlighted">
                        <div class="bank-label">NÚMERO DE CUENTA</div>
                        <div class="bank-value account">3680297372</div>
                    </div>
                    <div class="bank-info-cell">
                        <div class="bank-label">TITULAR</div>
                        <div class="bank-value">XIOMARA CASTILLO</div>
                    </div>
                </div>
            </div>

            <div class="reference-box">
                <div class="reference-label"> Número de referencia del pedido:</div>
                <div class="reference-value">${reference}</div>
            </div>

            <div class="instructions">
                <div class="instructions-title">
                     Instrucciones importantes
                </div>
                
                <div class="instruction-item">
                    <span class="instruction-icon">💵</span>
                    <span>Realiza la transferencia por el monto exacto mostrado arriba</span>
                </div>
                <div class="instruction-item">
                    <span class="instruction-icon">🧾</span>
                    <span>Conserva el comprobante de transferencia</span>
                </div>
                <div class="instruction-item">
                    <span class="instruction-icon">📞</span>
                    <span>Una vez realizada la transferencia, nos comunicaremos contigo</span>
                </div>
                <div class="instruction-item">
                    <span class="instruction-icon">⏰</span>
                    <span>El tiempo de procesamiento es de 24-48 horas hábiles</span>
                </div>
            </div>

            <div class="security-note">
                <strong>🔒 Nota de seguridad:</strong> Este email contiene información bancaria sensible. 
                No compartas estos datos con terceros y verifica siempre que estés realizando la transferencia 
                a los datos correctos mostrados arriba.
            </div>
        </div>

        <div class="footer">
            <p>Una vez realizada la transferencia, nuestro equipo verificará el pago y se comunicará contigo para coordinar la entrega de tu pedido.</p>
            
            <small>&copy; ${new Date().getFullYear()} BanDoggie. Todos los derechos reservados.</small>
            <small>Este email fue enviado porque realizaste una compra en nuestra tienda.</small>
        </div>
    </div>
</body>
</html>`;
};

// Función para testing
export const previewBankingEmail = (customerName = "Juan Pérez", totalAmount = 25.99, orderNumber = "UYBA4GQ") => {
    return HTMLSimpleBankingEmail(customerName, totalAmount, orderNumber);
};