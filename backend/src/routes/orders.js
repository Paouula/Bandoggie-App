import { Router } from "express";
import ordersController from '../controllers/ordersController.js';

const router = Router();

// Estadísticas y filtros
router.get('/stats', ordersController.getOrdersStats);                         // Estadísticas generales
router.get('/payment/:paymentMethod', ordersController.getOrdersByPaymentMethod); // Filtrar por método de pago
router.get('/date-range', ordersController.getOrdersByDateRange);             // Filtrar por rango de fechas

// Operaciones CRUD básicas
router.get('/', ordersController.getOrders);           // Obtener todas las órdenes
router.post('/', ordersController.createOrder);        // Crear nueva orden
router.get('/:id', ordersController.getOrderById);     // Obtener orden por ID
router.put('/:id', ordersController.updateOrder);      // Actualizar orden por ID
router.delete('/:id', ordersController.deleteOrder);   // Eliminar orden por ID

export default router;

