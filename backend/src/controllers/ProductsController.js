const productsController = {};
import productsModel from "../models/products.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import mongoose from "mongoose";

cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
  });


//SELECT
productsController.getProduct = async (req, res) => {
   try {
       const products = await productsModel.find()
           .populate('idHolidayProduct', 'nameHoliday')
           .populate('idCategory', 'nameCategory')
       res.json(products)
   } catch (error) {
       res.status(500).json({ message: error.message })
   }
}

//SELECT BY ID
productsController.getProductById = async (req, res) => {
   try {
       const product = await productsModel.findById(req.params.id)
           .populate('idHolidayProduct', 'nameHoliday')
           .populate('idCategory', 'nameCategory')
       
       if (!product) {
           return res.status(404).json({ message: "Product not found" })
       }
       
       res.json(product)
   } catch (error) {
       res.status(500).json({ message: error.message })
   }
}

//INSERT
productsController.insertProduct = async (req, res) => {
    try {
        const { nameProduct, price, description, idHolidayProduct, idCategory } = req.body;
        let imageUrl = "";
        let designImagesUrls = [];

        // Subir imagen principal si existe
        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: "products",
                allowed_formats: ["jpg", "png", "jpeg"],
            });
            imageUrl = result.secure_url;
        }

        // Subir imágenes de diseño si existen
        if (req.files && req.files.designImages) {
            if (!Array.isArray(req.files.designImages) || req.files.designImages.length < 3) {
                return res.status(400).json({ message: "Se requieren mínimo 3 imágenes de diseño" });
            }
            if (req.files.designImages.length > 10) {
                return res.status(400).json({ message: "Máximo 10 imágenes de diseño permitidas" });
            }
            for (const file of req.files.designImages) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products/designs",
                    allowed_formats: ["jpg", "png", "jpeg"],
                });
                designImagesUrls.push(result.secure_url);
            }
        } else {
            return res.status(400).json({ message: "El campo designImages es requerido y debe ser un array" });
        }
        
      const newProduct = new productsModel({
            nameProduct,
            price,
            description,
            image: imageUrl,
            designImages: designImagesUrls,
            idHolidayProduct,
            idCategory
        });

        await newProduct.save();

        const populatedProduct = await productsModel.findById(newProduct._id)
            .populate('idHolidayProduct', 'nameHoliday')
            .populate('idCategory', 'nameCategory');

        res.status(201).json({
            message: "Product saved successfully",
            product: populatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
};

//DELETE
productsController.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const deletedProduct = await productsModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

//UPDATE
productsController.updateProduct = async (req, res) => {
    try {
        const { nameProduct, price, description, idHolidayProduct, idCategory } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const existingProduct = await productsModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrl = existingProduct.image;
        let designImagesUrls = existingProduct.designImages;

        // Actualizar imagen principal si se envía
        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: "products",
                allowed_formats: ["jpg", "png", "jpeg"],
            });
            imageUrl = result.secure_url;
        }
         // Actualizar imágenes de diseño si se envían
        if (req.files && req.files.designImages) {
            if (!Array.isArray(req.files.designImages) || req.files.designImages.length < 3) {
                return res.status(400).json({ message: "Se requieren mínimo 3 imágenes de diseño" });
            }
            if (req.files.designImages.length > 10) {
                return res.status(400).json({ message: "Máximo 10 imágenes de diseño permitidas" });
            }
            designImagesUrls = [];
            for (const file of req.files.designImages) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products/designs",
                    allowed_formats: ["jpg", "png", "jpeg"],
                });
                designImagesUrls.push(result.secure_url);
            }
        }
         const updatedProduct = await productsModel.findByIdAndUpdate(
            id,
            {
                nameProduct,
                price,
                description,
                image: imageUrl,
                designImages: designImagesUrls,
                idHolidayProduct,
                idCategory
            },
            { new: true }
        ).populate('idHolidayProduct', 'nameHoliday')
         .populate('idCategory', 'nameCategory');

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

//SELECT BY CATEGORY
productsController.getProductsByCategory = async (req, res) => {
    try {
        const products = await productsModel.find({ idCategory: req.params.categoryId })
            .populate('idHolidayProduct', 'nameHoliday')
            .populate('idCategory', 'nameCategory')
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//SELECT BY HOLIDAY
productsController.getProductsByHoliday = async (req, res) => {
    try {
        const products = await productsModel.find({ idHolidayProduct: req.params.holidayId })
            .populate('idHolidayProduct', 'nameHoliday')
            .populate('idCategory', 'nameCategory')
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export default productsController;