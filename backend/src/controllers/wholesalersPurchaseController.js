import guestWholesalersModel from "../models/wholesalersPurchase.js";

const guestWholesalersController = {};

//SELECT
guestWholesalersController.getAllGuestWholesalers = async (req, res) => {
  try {
    const guestWholesalers = await guestWholesalersModel.find();
    res.status(200).json(guestWholesalers);
  } catch (error) {
    console.log("Error" + error);
    res.status(500).json({ message: "Error finding guest wholesalers" });
  }
};

//INSERT
guestWholesalersController.insertGuestWholesalers = async (req, res) => {
  const { emailGuestWholesalers, nameGuestWholesalers, lastNameGuestWholesalers, isActive } = req.body;

  try {
    //Validación de los campos no vengan vacios
    if (!emailGuestWholesalers || !nameGuestWholesalers || !lastNameGuestWholesalers || isActive === undefined) {
      return res.status(400).json({ message: "Ingrese todos los datos" });
    }

    //Validación email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(emailGuestWholesalers)) {
      return res.status(400).json({ message: "Ingrese un email válido" });
    }

    //Validación del nombre y apellido tengan al menos 2 caracteres
    if (nameGuestWholesalers.length < 2 || lastNameGuestWholesalers.length < 2) {
      return res.status(400).json({ message: "El nombre y apellido deben tener al menos 2 caracteres" });
    }

      //Guardar en la base de datos
      const newGuestWholesalers = new guestWholesalersModel({
        emailGuestWholesalers,
        nameGuestWholesalers,
        lastNameGuestWholesalers,
        isActive,
      });

      newGuestWholesalers.save();

    //Verificar que el email no esté duplicado
    const existingGuest = await guestWholesalersModel.findOne({ emailGuestWholesalers });
    if (existingGuest) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

  } catch (error) {
    console.log("Error" + error);
    res.status(400).json({ message: "Error saving guest wholesaler" });
  }
};

//ACTUALIZAR
guestWholesalersController.updateGuestWholesalers = async (req, res) => {
  try {
    const { emailGuestWholesalers, nameGuestWholesalers, lastNameGuestWholesalers, isActive } = req.body;

    //Validación email
    if (emailGuestWholesalers) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(emailGuestWholesalers)) {
        return res.status(400).json({ message: "Ingrese un email válido" });
      }

      //Verificar que el email no esté duplicado por otro usuario
      const existingGuest = await guestWholesalersModel.findOne({ 
        emailGuestWholesalers,
        _id: { $ne: req.params.id }
      });
      if (existingGuest) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
    }

    //Validación 
    if (nameGuestWholesalers && nameGuestWholesalers.length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    }

    if (lastNameGuestWholesalers && lastNameGuestWholesalers.length < 2) {
      return res.status(400).json({ message: "El apellido debe tener al menos 2 caracteres" });
    }

    //Actualizar los campos en la base de datos
    const updatedGuestWholesalers = await guestWholesalersModel.findByIdAndUpdate(
      req.params.id,
      { emailGuestWholesalers, nameGuestWholesalers, lastNameGuestWholesalers, isActive },
      { new: true }
    );

    if (!updatedGuestWholesalers) {
      return res.status(400).json({ message: "Guest wholesaler not found" });
    }

    res.status(200).json({ message: "Guest wholesaler updated successfully" });
  } catch (error) {
    console.log("error" + error);
    res.status(400).json({ message: "Error updating guest wholesaler" });
  }
};

//ELIMINAR
guestWholesalersController.deleteGuestWholesalers = async (req, res) => {
  try {
    const deletedGuestWholesalers = await guestWholesalersModel.findByIdAndDelete(req.params.id);

    if (!deletedGuestWholesalers) {
      return res.status(400).json({ message: "Guest wholesaler not found" });
    }

    res.status(200).json({ message: "Guest wholesaler deleted successfully" });
  } catch (error) {
    console.log("error" + error);
    res.status(400).json({ message: "Error deleting guest wholesaler" });
  }
};

export default guestWholesalersController;