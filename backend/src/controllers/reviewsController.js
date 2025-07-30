const reviewsController = {};

import reviewsModel from "../models/reviewsModel.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import mongoose from "mongoose";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
});

// SELECT - Obtener todas las reseñas
reviewsController.getReviews = async (req, res) => {
    try {
        const reviews = await reviewsModel.find()
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price')
            .sort({ publicationDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ 
            message: "Error al obtener las reseñas", 
            error: error.message 
        });
    }
};

// SELECT BY ID - Obtener reseña por ID
reviewsController.getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de reseña inválido" });
        }

        const review = await reviewsModel.findById(id)
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price');
        
        if (!review) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        
        res.status(200).json(review);
    } catch (error) {
        console.error("Error fetching review by ID:", error);
        res.status(500).json({ 
            message: "Error al obtener la reseña", 
            error: error.message 
        });
    }
};

// INSERT - Crear nueva reseña
reviewsController.insertReview = async (req, res) => {
    try {
        const { qualification, comment, idClient, idProduct } = req.body;
        let designImages = [];

        // Validaciones de campos requeridos
        if (!qualification) {
            return res.status(400).json({ message: "La calificación es requerida" });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: "El comentario es requerido" });
        }

        if (!idClient) {
            return res.status(400).json({ message: "El ID del cliente es requerido" });
        }

        if (!idProduct) {
            return res.status(400).json({ message: "El ID del producto es requerido" });
        }

        // Validación de calificación
        if (qualification < 1 || qualification > 5) {
            return res.status(400).json({
                message: "La calificación debe estar entre 1 y 5"
            });
        }

        // Validar IDs
        if (!mongoose.Types.ObjectId.isValid(idClient)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }

        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        // Subir imágenes a Cloudinary si existen (opcional)
        if (req.files && req.files.length > 0) {
            // Validar cantidad de imágenes
            if (req.files.length < 3) {
                return res.status(400).json({
                    message: "Se requieren mínimo 3 imágenes de diseño si se incluyen"
                });
            }

            if (req.files.length > 5) {
                return res.status(400).json({
                    message: "Máximo 5 imágenes de diseño permitidas"
                });
            }

            // Subir cada imagen
            for (const file of req.files) {
                try {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "reviews/designs",
                        allowed_formats: ["jpg", "png", "jpeg"],
                    });
                    designImages.push(result.secure_url);
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    return res.status(500).json({
                        message: "Error al subir las imágenes"
                    });
                }
            }
        }

        // Crear nueva reseña
        const newReview = new reviewsModel({
            qualification,
            comment: comment.trim(),
            designImages,
            idClient,
            idProduct
        });

        const savedReview = await newReview.save();

        // Populate la reseña recién creada
        const populatedReview = await reviewsModel.findById(savedReview._id)
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price');

        res.status(201).json({
            message: "Reseña creada exitosamente",
            review: populatedReview
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ 
            message: "Error al crear la reseña", 
            error: error.message 
        });
    }
};

// UPDATE - Actualizar reseña (solo comentario)
reviewsController.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de reseña inválido" });
        }

        // Verificar que la reseña existe
        const existingReview = await reviewsModel.findById(id);
        if (!existingReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }

        // Validar comentario
        if (!comment || !comment.trim()) {
            return res.status(400).json({ message: "El comentario es requerido" });
        }

        // Actualizar solo el comentario
        const updatedReview = await reviewsModel.findByIdAndUpdate(
            id,
            { comment: comment.trim() },
            { new: true, runValidators: true }
        )
        .populate('idClient', 'name email')
        .populate('idProduct', 'name price');

        res.status(200).json({
            message: "Comentario actualizado exitosamente",
            review: updatedReview
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ 
            message: "Error al actualizar la reseña", 
            error: error.message 
        });
    }
};

// DELETE - Eliminar reseña
reviewsController.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de reseña inválido" });
        }

        const deletedReview = await reviewsModel.findByIdAndDelete(id);
        
        if (!deletedReview) {
            return res.status(404).json({ message: "Reseña no encontrada" });
        }
        
        res.status(200).json({
            message: "Reseña eliminada exitosamente",
            review: deletedReview
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ 
            message: "Error al eliminar la reseña", 
            error: error.message 
        });
    }
};

// SELECT BY PRODUCT - Obtener reseñas por producto
reviewsController.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        const reviews = await reviewsModel.find({ idProduct: productId })
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price')
            .sort({ publicationDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews by product:", error);
        res.status(500).json({ 
            message: "Error al obtener reseñas por producto", 
            error: error.message 
        });
    }
};

// SELECT BY CLIENT - Obtener reseñas por cliente
reviewsController.getReviewsByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }

        const reviews = await reviewsModel.find({ idClient: clientId })
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price')
            .sort({ publicationDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews by client:", error);
        res.status(500).json({ 
            message: "Error al obtener reseñas por cliente", 
            error: error.message 
        });
    }
};

// SELECT BY QUALIFICATION - Obtener reseñas por calificación
reviewsController.getReviewsByQualification = async (req, res) => {
    try {
        const qualification = parseInt(req.params.qualification);
        
        if (isNaN(qualification) || qualification < 1 || qualification > 5) {
            return res.status(400).json({ 
                message: "La calificación debe estar entre 1 y 5" 
            });
        }
        
        const reviews = await reviewsModel.find({ qualification: qualification })
            .populate('idClient', 'name email')
            .populate('idProduct', 'name price')
            .sort({ publicationDate: -1 });
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews by qualification:", error);
        res.status(500).json({ 
            message: "Error al obtener reseñas por calificación", 
            error: error.message 
        });
    }
};

// STATISTICS - Obtener estadísticas de reseñas por producto
reviewsController.getProductReviewStats = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        const stats = await reviewsModel.aggregate([
            { $match: { idProduct: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: "$idProduct",
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: "$qualification" },
                    ratings: {
                        $push: {
                            rating: "$qualification",
                            count: 1
                        }
                    }
                }
            },
            {
                $project: {
                    totalReviews: 1,
                    averageRating: { $round: ["$averageRating", 2] },
                    ratingDistribution: {
                        $arrayToObject: {
                            $map: {
                                input: [1, 2, 3, 4, 5],
                                as: "rating",
                                in: {
                                    k: { $toString: "$$rating" },
                                    v: {
                                        $size: {
                                            $filter: {
                                                input: "$ratings",
                                                cond: { $eq: ["$$this.rating", "$$rating"] }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]);
        
        if (stats.length === 0) {
            return res.status(200).json({
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
            });
        }
        
        res.status(200).json(stats[0]);
    } catch (error) {
        console.error("Error fetching product review stats:", error);
        res.status(500).json({ 
            message: "Error al obtener estadísticas de reseñas", 
            error: error.message 
        });
    }
};

export default reviewsController;