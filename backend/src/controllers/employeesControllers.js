import employeesModel from "../models/employees.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

const employeesControllers = {};

// Aquí traemos a todos los empleados de la base de datos
employeesControllers.get = async (req, res) => {
  try {
    const employees = await employeesModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos: " + error });
  }
};

// Esta función es la que se encarga de revisar si los datos vienen como deben
const validateEmployeeFields = (data, isUpdate = false) => {
  const errors = [];

  // Que el nombre sea solo letras y espacios
  if (!data.name || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,40}$/.test(data.name)) {
    errors.push("Nombre inválido");
  }

  // El correo debe estar presente y ser verdadero correo
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push("Correo electrónico inválido");
  }

  // Teléfono con formato 1111-1111
  if (!data.phoneEmployees || !/^\d{4}-\d{4}$/.test(data.phoneEmployees)) {
    errors.push("Teléfono inválido (formato 1111-1111)");
  }

  // Fecha de nacimiento válida y que no sea un mocoso
  if (!data.dateOfBirth || !validator.isDate(data.dateOfBirth)) {
    errors.push("Fecha de nacimiento inválida");
  } else {
    const age =
      new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    if (age < 18) errors.push("El empleado debe ser mayor de edad");
  }

  // La dirección debe estar, y no andar con cosas vacías
  if (!data.addressEmployees || data.addressEmployees.trim().length < 5) {
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

  // Que la fecha de contratación sea válida
  if (!data.hireDateEmployee || !validator.isDate(data.hireDateEmployee)) {
    errors.push("Fecha de contratación inválida");
  }

  // El DUI debe tener su formato correcto
  if (!data.duiEmployees || !/^\d{8}-\d{1}$/.test(data.duiEmployees)) {
    errors.push("DUI inválido (formato 12345678-9)");
  }

  return errors;
};

// Aquí registramos al nuevo empleado, cuidando que todo venga en orden
employeesControllers.post = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneEmployees,
      dateOfBirth,
      addressEmployees,
      password,
      hireDateEmployee,
      duiEmployees,
    } = req.body;

    // Primero revisamos que todos los datos estén bien, sin error alguno
    const validationErrors = validateEmployeeFields(req.body);
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    // Comprobamos que ese correo no esté ya en nuestra lista
    const exists = await employeesModel.findOne({ email });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    // Encriptamos la contraseña para que no ande en claro por ahí
    const passwordHash = await bcryptjs.hash(password, 10);

    // Ahora sí, creamos al empleado y lo guardamos en la base
    const newEmployee = new employeesModel({
      name,
      email,
      phoneEmployees,
      dateOfBirth,
      addressEmployees,
      password: passwordHash,
      hireDateEmployee,
      duiEmployees,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Empleado registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al insertar datos: " + error });
  }
};

// Para actualizar al empleado, pasamos por el mismo rigor en las pruebas
employeesControllers.put = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneEmployees,
      dateOfBirth,
      addressEmployees,
      password,
      hireDateEmployee,
      duiEmployees,
    } = req.body;

    const idToUpdate = req.params.id; 

    const validationErrors = validateEmployeeFields(req.body, true);
    if (validationErrors.length) {
      return res.status(400).json({ message: validationErrors.join(", ") });
    }

    const existing = await employeesModel.findOne({ email });
    if (existing && existing._id.toString() !== idToUpdate) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const updateData = {
      name,
      email,
      phoneEmployees,
      dateOfBirth,
      addressEmployees,
      hireDateEmployee,
      duiEmployees,
    };

    if (password) updateData.password = await bcryptjs.hash(password, 10);

    await employeesModel.findByIdAndUpdate(idToUpdate, updateData, { new: true });

    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar datos: " + error });
  }
};


// Y para eliminar un empleado, solo buscamos por id y lo borramos
employeesControllers.delete = async (req, res) => {
  try {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar empleado: " + error });
  }
};

export default employeesControllers;
