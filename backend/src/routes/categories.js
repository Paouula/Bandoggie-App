import express from "express"
import CategoriasControllers from "../controllers/categoriesControllers.js"

const router = express.Router();

router 
.route("/")
.get(CategoriasControllers.getcategorias)
.post(CategoriasControllers.createcategorias);

router
.route("/:id")
.put(CategoriasControllers.updatecategorias)
.delete(CategoriasControllers.deletecategorias);

export default router;