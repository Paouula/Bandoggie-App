import guestClientsModel from "../models/retailsPurchase.js";

const guestClientsController = {};

//SELECT
guestClientsController.getAllGuestClients = async (req, res) => {
  try {
    const guestClients = await guestClientsModel.find();
    res.status(200).json(guestClients);
  } catch (error) {
    console.log("Error" + error);
    res.status(500).json({ message: "Error finding guest clients" });
  }
};

//INSERT
guestClientsController.insertGuestClients = async (req, res) => {
  const { emailGuestClients, nameGuestClients, lastNameGuestClients, isActive } = req.body;

  try {
    //Validación para que los campos no vengan vacios
    if (!emailGuestClients || !nameGuestClients || !lastNameGuestClients || isActive === undefined) {
      return res.status(400).json({ message: "Ingrese todos los datos" });
    }

    //Validación en formato de email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(emailGuestClients)) {
      return res.status(400).json({ message: "Ingrese un email válido" });
    }

    //Validación que el nombre y apellido tengan al menos 2 caracteres
    if (nameGuestClients.length < 2 || lastNameGuestClients.length < 2) {
      return res.status(400).json({ message: "El nombre y apellido deben tener al menos 2 caracteres" });
    }

    //Verificar que el email no esté duplicado
    const existingGuest = await guestClientsModel.findOne({ emailGuestClients });
    if (existingGuest) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    //Guardar en la base de datos
    const newGuestClients = new guestClientsModel({
      emailGuestClients,
      nameGuestClients,
      lastNameGuestClients,
      isActive,
    });

    await newGuestClients.save();

    res.status(200).json({ message: "Guest client saved successfully" });
  } catch (error) {
    console.log("Error" + error);
    res.status(400).json({ message: "Error saving guest client" });
  }
};

//ACTUALIZAR
guestClientsController.updateGuestClients = async (req, res) => {
  try {
    const { emailGuestClients, nameGuestClients, lastNameGuestClients, isActive } = req.body;

    //Validación del dormato de email 
    if (emailGuestClients) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(emailGuestClients)) {
        return res.status(400).json({ message: "Ingrese un email válido" });
      }

      //Verificar que el email no esté duplicado por otro usuario
      const existingGuest = await guestClientsModel.findOne({ 
        emailGuestClients,
        _id: { $ne: req.params.id }
      });
      if (existingGuest) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
    }

    //Validar longitud de nombre y apellido
    if (nameGuestClients && nameGuestClients.length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    }

    if (lastNameGuestClients && lastNameGuestClients.length < 2) {
      return res.status(400).json({ message: "El apellido debe tener al menos 2 caracteres" });
    }

    //Actualizar los campos en la base de datos
    const updatedGuestClients = await guestClientsModel.findByIdAndUpdate(
      req.params.id,
      { emailGuestClients, nameGuestClients, lastNameGuestClients, isActive },
      { new: true }
    );

    if (!updatedGuestClients) {
      return res.status(400).json({ message: "Guest client not found" });
    }

    res.status(200).json({ message: "Guest client updated successfully" });
  } catch (error) {
    console.log("error" + error);
    res.status(400).json({ message: "Error updating guest client" });
  }
};

//ELIMINAR
guestClientsController.deleteGuestClients = async (req, res) => {
  try {
    const deletedGuestClients = await guestClientsModel.findByIdAndDelete(req.params.id);

    if (!deletedGuestClients) {
      return res.status(400).json({ message: "Guest client not found" });
    }

    res.status(200).json({ message: "Guest client deleted successfully" });
  } catch (error) {
    console.log("error" + error);
    res.status(400).json({ message: "Error deleting guest client" });
  }
};

export default guestClientsController;