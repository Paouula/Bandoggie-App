import vetModel from '../models/vets.js';
import clientsModel from '../models/clients.js';
import { config } from '../config.js';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import sendVerificationEmail from '../utils/verificationCode.js';

const registerVetController = {};

// Aquí se registra el veterinario, pero ojo, antes valida que los datos no estén vacíos ni mal formados
registerVetController.register = async (req, res) => {
  const { nameVet, email, password, locationVet, nitVet } = req.body;

  // No andes dejando campos vacíos, que eso no es bueno
  if (!nameVet || !email || !password || !locationVet || !nitVet) {
    return res.status(400).json({ message: "Faltan datos obligatorios para el registro" });
  }

  // Validar que el correo tenga forma decente
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  // La contraseña debe tener al menos 8 caracteres, no seas tacaño con la seguridad
  if (password.length < 8) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    // Buscar si ya existe un vet o cliente con ese correo, que no haya duplicados
    const existingVet = await vetModel.findOne({ email });
    const existingEmail = await clientsModel.findOne({ email });
    if (existingVet || existingEmail) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }

    // Hashear la contraseña antes de guardarla, que no se te olvide
    const passwordHash = await bcryptjs.hash(password, 10);

    // Crear el veterinario con sus datos bien limpiecitos
    const newVet = new vetModel({
      nameVet,
      email,
      password: passwordHash,
      locationVet,
      nitVet,
    });
    await newVet.save();

    // Generar código de verificación para el correo, así nadie se cuela
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Crear token para verificar, que dure dos horas
    const token = jsonwebtoken.sign(
      { email, verificationCode },
      config.JWT.secret,
      { expiresIn: '2h' }
    );

    // Guardar el token en cookie httpOnly para seguridad
    res.cookie('VerificationToken', token, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Mandar el correo con el código para que el vet confirme su email
    await sendVerificationEmail(email, verificationCode);

    // Avisar que todo fue bien, pero que revise su correo
    res.status(201).json({ message: "Veterinario registrado, verifica tu correo para activar la cuenta." });
  } catch (error) {
    console.log('Error: ' + error);
    res.status(500).json({ message: "Error en el registro", error });
  }
};

// Aquí se verifica el código que llegó por correo para confirmar el email
registerVetController.verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.VerificationToken;

  // Si no hay token, no podemos seguir, anda a pedirlo primero
  if (!token) {
    return res.status(401).json({ message: "Token no encontrado" });
  }

  try {
    // Verificar que el token sea válido y no haya expirado
    const decode = jsonwebtoken.verify(token, config.JWT.secret);

    // Si el código no cuadra, ni sueñes con pasar
    if (decode.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Código de verificación incorrecto" });
    }

    // Ya validado el correo, limpiamos la cookie y avisamos al usuario
    res.clearCookie('VerificationToken');
    res.status(200).json({ message: "Correo verificado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Token inválido o expirado", error });
  }
};

export default registerVetController;
