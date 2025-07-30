import express from 'express';
import productsController from '../controllers/productsController.js';

const router = express.Router();

// Rutas principales
router.route('/').get(productsController.getProduct)
.post(productsController.insertProduct);

// Ruta para obtener producto por ID
router.route('/:id')
.get(productsController.getProductById)
.put(productsController.updateProduct)
.delete(productsController.deleteProduct)

// Rutas para filtrar productos
router.route('/category/:categoryId')
.get(productsController.getProductsByCategory);

router.route('/holiday/:holidayId')
.get(productsController.getProductsByHoliday);

export default router;