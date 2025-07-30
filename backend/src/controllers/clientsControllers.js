import clientsModel from "../models/clients.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const clientsControllers = {};

// Lista de clientes
clientsControllers.get = async (req, res) => {
  try {
    const clients = await clientsModel.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

// Crea un cliente nuevo, pero ojo, valida antes de crear
clientsControllers.post = async (req, res) => {
  const { name, email, phone, dateOfBirth, password } = req.body;

  // Validación rudimentaria, no vayas a mandar campos vacíos
  if (!name || !email || !phone || !dateOfBirth || !password) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Validar que el correo tenga formato decente
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  // Validar que la contraseña tenga al menos 8 caracteres
  if (password.length < 8) {
    return res.status(400).json({ message: "La contraseña es muy corta" });
  }

  let imgUrl = "";
  try {
    // Si hay imagen, súbela a la nube sin hacer lío
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imgUrl = result.secure_url;
    }

    // Hashea la contraseña antes de guardarla, que no se te olvide
    const passwordHash = await bcryptjs.hash(password, 10);

    // Crea el cliente nuevo con los datos limpios y sanos
    const newClient = new clientsModel({
      name,
      email,
      phone,
      dateOfBirth,
      password: passwordHash,
      image: imgUrl,
    });

    await newClient.save();

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};

// Aquí actualizamos cliente, pero con prudencia y cuidado
clientsControllers.put = async (req, res) => {
  const { name, email, phone, dateOfBirth, password } = req.body;
  const { id } = req.params;

  // Validamos el id, que sea válido y no un disparate
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de cliente inválido" });
  }

  // Validar campos obligatorios para la actualización
  if (!name || !email || !phone || !dateOfBirth) {
    return res.status(400).json({ message: "Faltan datos obligatorios para actualizar" });
  }

  // Validar correo y contraseña si viene
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }
  if (password && password.length < 8) {
    return res.status(400).json({ message: "La contraseña es muy corta" });
  }

  try {
    const existingClient = await clientsModel.findById(id);
    if (!existingClient) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    let imgUrl = "";

    // Si hay imagen nueva, súbela y actualiza, si no usa la vieja
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "public",
          allowed_formats: ["jpg", "png", "jpeg"],
        });
        imgUrl = result.secure_url;
      } catch (error) {
        console.error("Error al subir imagen:", error);
        return res.status(500).json({ error: "Error al subir la imagen" });
      }
    }

    // Si te dan contraseña, hazhea, si no deja la que ya había
    const passwordHash = password
      ? await bcryptjs.hash(password, 10)
      : existingClient.password;

    // Actualiza el cliente con los datos nuevos
    const updatedClient = await clientsModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        dateOfBirth,
        password: passwordHash,
        image: imgUrl || existingClient.image,
      },
      { new: true }
    );

    res.json({ message: "Cliente actualizado con éxito", updatedClient });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Error actualizando cliente", error });
  }
};

// Borra con cuidado, pero si te lo piden, borra el cliente
clientsControllers.delete = async (req, res) => {
  const { id } = req.params;

  // Validar ID antes de proceder al duelo
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID inválido para eliminar" });
  }

  try {
    const deletedClient = await clientsModel.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({ message: "Cliente no hallado para borrar" });
    }

    res.json({ message: "Cliente eliminado con éxito", deletedClient });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error eliminando cliente", error });
  }
};

export default clientsControllers;
