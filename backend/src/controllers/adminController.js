import adminModel from "../models/admin.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

const adminController = {};

// Aquí traemos a todos los empleados de la base de datos
adminController.get = async (req, res) => {
  try {
    const admin = await adminModel.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos: " + error });
  }
};

// Esta función es la que se encarga de revisar si los datos vienen como deben
const validateAdminFields = (data, isUpdate = false) => {
  const errors = [];

  // Que el nombre sea solo letras y espacios, ni corto ni largo
  if (!data.nameAdmin || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,40}$/.test(data.nameAdmin)) {
    errors.push("Nombre inválido");
  }

  // El correo debe estar presente y ser verdadero correo
  if (!data.emailAdmin || !validator.isEmail(data.emailAdmin)) {
    errors.push("Correo electrónico inválido");
  }

  // Teléfono con formato 1111-1111
  if (!data.phoneAdmin || !/^\d{4}-\d{4}$/.test(data.phoneAdmin)) {
    errors.push("Teléfono inválido (formato 1111-1111)");
  }

  // Fecha de nacimiento válida y que no sea un mocoso
  if (!data.dateOfBirth || !validator.isDate(data.dateOfBirth)) {
    errors.push("Fecha de nacimiento inválida");
  } else {
    const age =
      new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    if (age < 18) errors.push("Debe ser mayor de edad");
  }

  // La dirección debe estar, y no andar con cosas vacías
  if (!data.addressAdmin || data.addressAdmin.trim().length < 5) {
    errors.push("Dirección obligatoria");
  }

  // La contraseña solo se revisa si es creación o si la envían para actualizar
  if (!isUpdate || data.password) {
    if (
      !data.password ||
      data.password.length < 8 ||
      data.password.length > 30
    ) {
      errors.push("Contraseña entre 8 y 30 caracteres");
    }
  }

  return errors;
};

// Aquí registramos al nuevo empleado, cuidando que todo venga en orden
adminController.post = async (req, res) => {
  try {
    const {
      nameAdmin,
      emailAdmin,
      phoneAdmin,
      dateOfBirth,
      addressAdmin,
      password
    } = req.body;

    // Primero revisamos que todos los datos estén bien, sin error alguno
    const validationErrors = validateAdminFields(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    // Comprobamos que ese correo no esté ya en nuestra lista
    const exists = await adminModel.findOne({ emailAdmin });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    // Encriptamos la contraseña para que no ande en claro por ahí
    const passwordHash = await bcryptjs.hash(password, 10);

    // Ahora sí, creamos al empleado y lo guardamos en la base
    const newAdmin = new adminModel({
      nameAdmin,
      emailAdmin,
      phoneAdmin,
      dateOfBirth,
      addressAdmin,
      password: passwordHash,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Empleado registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al insertar datos: " + error });
  }
};

// Para actualizar al empleado, pasamos por el mismo rigor en las pruebas
adminController.put = async (req, res) => {
  try {
    const id = req.params.id; 
    const {
      nameAdmin,
      emailAdmin,
      phoneAdmin,
      dateOfBirth,
      addressAdmin,
      password,
    } = req.body;

    // Validamos los datos otra vez
    const validationErrors = validateAdminFields(req.body, true);
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    // Buscamos si hay otro admin con ese email (distinto id)
    const existing = await adminModel.findOne({ emailAdmin });
    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Preparar datos para actualizar
    const updateData = {
      nameAdmin,
      emailAdmin,
      phoneAdmin,
      dateOfBirth,
      addressAdmin,
    };

    if (password) {
      updateData.password = await bcryptjs.hash(password, 10);
    }

    await adminModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar datos: " + error });
  }
};


// Y para eliminar un empleado, solo buscamos por id y lo borramos
adminController.delete = async (req, res) => {
  try {
    await adminModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado: " + error });
  }
};

export default adminController;
