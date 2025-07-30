import clientsModel from '../models/clients.js';
import vetModel from '../models/vets.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config.js';
import { sendMail, HTMLRecoveryEmail } from '../utils/passwordRecovery.js';
import validator from 'validator';

const passwordRecovery = {};

// Aquí el buen hombre pide que se le envíe un código para recuperar su contraseña
passwordRecovery.requestCode = async (req, res) => {
  const { email } = req.body;

  // Validamos que el correo venga y sea de verdad un correo
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Correo inválido o ausente' });
  }

  try {
    let userFound;
    let userType;

    // Buscamos primero entre los clientes
    userFound = await clientsModel.findOne({ email });
    if (userFound) {
      userType = 'client';
    } else {
      // Si no aparece, buscamos en veterinarios
      userFound = await vetModel.findOne({ email });
      if (userFound) {
        userType = 'vet';
      }
    }

    // Si no encontramos a nadie, avisamos al buen hombre que no está registrado
    if (!userFound) {
      return res.status(400).json({ message: 'No se ha encontrado ningún usuario' });
    }

    // Generamos un código aleatorio para verificar la identidad
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Armamos un token con la info necesaria, y lo sellamos para 30 minutos
    const token = jsonwebtoken.sign(
      { email, code, userType, verified: false },
      config.JWT.secret,
      { expiresIn: '30m' }
    );

    // Guardamos el token en una cookie segura y temporal
    res.cookie('tokenRecoveryCode', token, {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      sameSite: 'Lax',
    });

    // Mandamos el correo con el código para que el hombre pueda continuar
    await sendMail(
      email,
      'Password Recovery Code',
      `Este es tu código de verificación: ${code}`,
      HTMLRecoveryEmail(code)
    );

    return res.status(200).json({ message: 'Código de recuperación enviado con éxito' });
  } catch (error) {
    console.error('Error: ' + error);
    return res.status(500).json({ message: 'Error al enviar el correo', error });
  }
};

// Aquí el hombre envía el código y queremos confirmar que sea el correcto
passwordRecovery.verifyCode = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'El código es requerido' });
  }

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) {
      return res.status(401).json({ message: 'Token no encontrado' });
    }

    // Decodificamos el token para comprobar el código
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (decoded.code !== code.toUpperCase()) {
      return res.status(400).json({ message: 'El código es incorrecto' });
    }

    // Generamos otro token ya con la verificación hecha, para seguir el proceso
    const newToken = jsonwebtoken.sign(
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      config.JWT.secret,
      { expiresIn: '20m' }
    );

    res.cookie('tokenRecoveryCode', newToken, {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      sameSite: 'Lax',
    });

    return res.status(200).json({ message: 'Código verificado con éxito' });
  } catch (error) {
    console.error('Error: ' + error);
    return res.status(500).json({ message: 'Token inválido o expirado', error });
  }
};

// Finalmente, cuando el hombre quiere cambiar su contraseña ya verificada
passwordRecovery.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  // Validamos que la contraseña venga y cumpla con los mínimos
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres' });
  }

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) {
      return res.status(401).json({ message: 'Token no encontrado' });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (!decoded.verified) {
      return res.status(403).json({ message: 'Código no verificado' });
    }

    const { email, userType } = decoded;

    // Buscamos al usuario según su tipo para cambiar la contraseña
    let user;
    if (userType === 'client') {
      user = await clientsModel.findOne({ email });
    } else if (userType === 'vet') {
      user = await vetModel.findOne({ email });
    }

    // Si no existe, decimos que no encontramos al buen hombre
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comprobamos que la nueva contraseña no sea igual a la vieja
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    // Encriptamos la nueva contraseña y la guardamos
    const hashPassword = await bcryptjs.hash(newPassword, 10);

    if (userType === 'client') {
      await clientsModel.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
    } else {
      await vetModel.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true });
    }

    // Limpiamos la cookie que ya no hace falta y avisamos del éxito
    res.clearCookie('tokenRecoveryCode');
    return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error: ' + error);
    return res.status(500).json({ message: 'Error al actualizar la contraseña', error });
  }
};

export default passwordRecovery;
