//Array de metodos (C R U D)
const CategoriasControllers = {};
import CategoriasModel from "../models/categories.js";

// SELECT
CategoriasControllers.getcategorias = async (req, res) => {
  const categorias = await CategoriasModel.find();
  res.json(categorias);
};

// INSERT
CategoriasControllers.createcategorias = async (req, res) => {
  const { nameCategory } = req.body;
  const newccategorias = new CategoriasModel({ nameCategory });
  await newccategorias.save();
  res.json({ message: "Categoria Guardada" });
};

// DELETE
CategoriasControllers.deletecategorias = async (req, res) => {
const deletecategorias = await CategoriasModel.findByIdAndDelete(req.params.id);
  if (!deletecategorias) {
    return res.status(404).json({ message: "Categorias no se encuentran" });
  }
  res.json({ message: "Categoria Eliminada" });
};

// UPDATE
CategoriasControllers.updatecategorias = async (req, res) => {
  // Solicito todos los valores
  const { nameCategory } = req.body;
  // Actualizo
  await CategoriasModel.findByIdAndUpdate(
    req.params.id,
    {
        nameCategory
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "Categoria Actualizada" });
};

export default CategoriasControllers;