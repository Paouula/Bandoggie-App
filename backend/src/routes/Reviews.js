import { Router } from "express";
import reviewsController from '../controllers/reviewsController.js';
import multer from 'multer';

// Configuración de multer para manejar la subida de imágenes
const upload = multer({ 
  dest: 'uploads/reviews/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});


const router = Router();
router.get('/product/:productId', reviewsController.getReviewsByProduct);// Obtiene todas las reseñas de un producto por su ID
router.get('/client/:clientId', reviewsController.getReviewsByClient);// Obtiene todas las reseñas hechas por un cliente específico
router.get('/qualification/:qualification', reviewsController.getReviewsByQualification);// Obtiene todas las reseñas con una calificación específica
router.get('/stats/product/:productId', reviewsController.getProductReviewStats);// Obtiene estadísticas de reseñas de un producto (por ejemplo, promedio de calificaciones)


// Obtiene todas las reseñas sin filtros
router.get('/', reviewsController.getReviews);
// Inserta una nueva reseña:
router.post('/', upload.array('designImages', 5), reviewsController.insertReview);
// Obtiene una sola reseña por su ID
router.get('/:id', reviewsController.getReviewById);
// Actualiza una reseña por su ID
router.put('/:id', reviewsController.updateReview);
// Elimina una reseña por su ID
router.delete('/:id', reviewsController.deleteReview);

export default router;
