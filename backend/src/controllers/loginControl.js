import clientsModel from "../models/clients.js";
import Employees from "../models/employees.js";
import VetModel from "../models/vets.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import validator from "validator";

const loginController = {};

// Este es el encargado de verificar si el usuario puede entrar al sistema
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  // Validamos que nos envíen un correo y una contraseña, nada de vacíos
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Correo electrónico inválido o faltante" });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ message: "La contraseña es obligatoria y debe tener al menos 8 caracteres" });
  }

  try {
    let userFound;
    let userType;

    // Primero buscamos si es un cliente con ese correo
    userFound = await clientsModel.findOne({ email });
    if (userFound) {
      userType = "client";
    } else {
      // Si no, buscamos si es un veterinario
      userFound = await VetModel.findOne({ email });
      if (userFound) {
        userType = "vet";
      } else {
        // Finalmente, si no apareció, buscamos entre empleados
        userFound = await Employees.findOne({ email });
        if (userFound) {
          userType = "employee";
        }
      }
    }

    // Si no encontramos a nadie, decimos que no existe el usuario
    if (!userFound) {
      return res.status(400).json({ message: "No se ha podido encontrar al usuario" });
    }

    // Comprobamos que la contraseña que enviaron sea la misma que la guardada
    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Si todo está bien, creamos un token para que pueda usar el sistema
    jsonwebtoken.sign(
      { user: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn },
      (error, token) => {
        if (error) {
          // Si hay fallo creando el token, avisamos que algo no salió bien
          return res.status(500).json({ message: "Error al generar el token" });
        }

        // Ponemos el token en una cookie segura para que el cliente lo guarde
        res.cookie("authToken", token, {
          httpOnly: true,
          sameSite: "lax",
          // secure: true // recuerda activar esto cuando estés en producción con HTTPS
        });

        // Finalmente, decimos que el login fue exitoso y enviamos qué tipo de usuario es
        return res.status(200).json({
          message: "Login exitoso",
          userType,
          token, // Agregar esta línea
          user: { 
            email: userFound.email,
            _id: userFound._id 
          } // Agregar info del usuario
        });
      }
    );
  } catch (error) {
    // Si algo inesperado pasa, lo registramos y avisamos al cliente
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default loginController;
