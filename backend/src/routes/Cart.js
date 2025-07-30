import { Router } from "express";
import CartController from "../controllers/cartControllers.js"

const router = Router();

// Estadísticas del carrito
router.get("/stats", CartController.getCartStats);

// Obtener carrito por cliente
router.get("/client/:clientId", CartController.getByClient);

// Operaciones CRUD básicas
router.get("/", CartController.getAll);        // Obtener todos los carritos
router.post("/", CartController.create);       // Crear nuevo carrito
router.get("/:id", CartController.getById);    // Obtener carrito por ID
router.put("/:id", CartController.update);     // Actualizar carrito por ID
router.delete("/:id", CartController.delete);  // Eliminar carrito por ID

// Productos dentro del carrito
router.post("/:id/products", CartController.addProduct);                // Agregar producto
router.delete("/:id/products/:productId", CartController.removeProduct); // Eliminar producto específico
router.put("/:id/clear", CartController.clearCart);                     // Vaciar carrito

export default router;
