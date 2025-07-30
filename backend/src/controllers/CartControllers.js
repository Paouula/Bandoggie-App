import Cart from "../models/cart.js";
import mongoose from "mongoose";

const CartController = {};

// GET ALL - Obtener todos los carritos 
CartController.getAll = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category')
            .sort({ createdAt: -1 });
        
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.status(500).json({ 
            message: "Error al obtener los carritos", 
            error: error.message 
        });
    }
};

//  GET BY ID - Obtener carrito por ID
CartController.getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        const cart = await Cart.findById(id)
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category');
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart by ID:", error);
        res.status(500).json({ 
            message: "Error al obtener el carrito", 
            error: error.message 
        });
    }
};

// GET BY CLIENT - Obtener carrito por cliente 
CartController.getByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        // Validar ID del cliente
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }

        const cart = await Cart.findOne({ idClient: clientId })
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category');
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado para este cliente" });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart by client:", error);
        res.status(500).json({ 
            message: "Error al obtener el carrito del cliente", 
            error: error.message 
        });
    }
};

// CREATE - Crear nuevo carrito 
CartController.create = async (req, res) => {
    try {
        const { idClient, products } = req.body;

        // Validaciones de campos requeridos
        if (!idClient) {
            return res.status(400).json({ message: "El ID del cliente es requerido" });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Se requiere al menos un producto en el carrito" });
        }

        // Validar ID del cliente
        if (!mongoose.Types.ObjectId.isValid(idClient)) {
            return res.status(400).json({ message: "ID de cliente inválido" });
        }

        // Validar cada producto
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            if (!product.idProduct) {
                return res.status(400).json({ 
                    message: `El ID del producto es requerido en el producto ${i + 1}` 
                });
            }

            if (!mongoose.Types.ObjectId.isValid(product.idProduct)) {
                return res.status(400).json({ 
                    message: `ID de producto inválido en el producto ${i + 1}` 
                });
            }

            if (!product.quantity || product.quantity < 1) {
                return res.status(400).json({ 
                    message: `La cantidad debe ser al menos 1 en el producto ${i + 1}` 
                });
            }

            if (!product.subtotal || product.subtotal < 0) {
                return res.status(400).json({ 
                    message: `El subtotal no puede ser negativo en el producto ${i + 1}` 
                });
            }

            // Validar talla si se proporciona
            if (product.talla) {
                const validSizes = ['XS', 'S', 'M', 'L', 'XL'];
                if (!validSizes.includes(product.talla)) {
                    return res.status(400).json({ 
                        message: `Talla inválida en el producto ${i + 1}. Las tallas válidas son: ${validSizes.join(', ')}` 
                    });
                }
            }
        }

        // Calcular total
        const total = products.reduce((sum, product) => sum + product.subtotal, 0);

        if (total < 0) {
            return res.status(400).json({ message: "El total del carrito no puede ser negativo" });
        }

        // Verificar si el cliente ya tiene un carrito pendiente
        const existingCart = await Cart.findOne({ 
            idClient: idClient, 
            status: 'Pending' 
        });

        if (existingCart) {
            return res.status(409).json({ 
                message: "El cliente ya tiene un carrito pendiente. Use la función de actualizar para modificarlo." 
            });
        }

        // Crear nuevo carrito
        const newCart = new Cart({
            idClient,
            products,
            total,
            status: 'Pending'
        });

        await newCart.save();

        // Populate el carrito recién creado
        const populatedCart = await Cart.findById(newCart._id)
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category');

        res.status(201).json({
            message: "Carrito creado exitosamente",
            cart: populatedCart
        });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ 
            message: "Error al crear el carrito", 
            error: error.message 
        });
    }
};

//  UPDATE - Actualizar carrito 
CartController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, status } = req.body;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        // Verificar que el carrito existe
        const existingCart = await Cart.findById(id);
        if (!existingCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Preparar datos para actualización
        const updateData = {};

        // Validar productos si se proporcionan
        if (products) {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: "Se requiere al menos un producto en el carrito" });
            }

            // Validar cada producto
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                
                if (!product.idProduct || !mongoose.Types.ObjectId.isValid(product.idProduct)) {
                    return res.status(400).json({ 
                        message: `ID de producto inválido en el producto ${i + 1}` 
                    });
                }

                if (!product.quantity || product.quantity < 1) {
                    return res.status(400).json({ 
                        message: `La cantidad debe ser al menos 1 en el producto ${i + 1}` 
                    });
                }

                if (product.subtotal === undefined || product.subtotal < 0) {
                    return res.status(400).json({ 
                        message: `El subtotal no puede ser negativo en el producto ${i + 1}` 
                    });
                }

                // Validar talla si se proporciona
                if (product.talla) {
                    const validSizes = ['XS', 'S', 'M', 'L', 'XL'];
                    if (!validSizes.includes(product.talla)) {
                        return res.status(400).json({ 
                            message: `Talla inválida en el producto ${i + 1}. Las tallas válidas son: ${validSizes.join(', ')}` 
                        });
                    }
                }
            }

            // Calcular nuevo total
            const total = products.reduce((sum, product) => sum + product.subtotal, 0);
            updateData.products = products;
            updateData.total = total;
        }

        // Validar status si se proporciona
        if (status) {
            const validStatuses = ['Pending', 'Paid'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    message: `Estado inválido. Los estados válidos son: ${validStatuses.join(', ')}` 
                });
            }
            updateData.status = status;
        }

        // Verificar que hay datos para actualizar
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
        }

        // Actualizar carrito
        const updatedCart = await Cart.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('idClient', 'name email')
        .populate('products.idProduct', 'name price category');

        res.status(200).json({
            message: "Carrito actualizado exitosamente",
            cart: updatedCart
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ 
            message: "Error al actualizar el carrito", 
            error: error.message 
        });
    }
};

// ADD PRODUCT - Agregar producto al carrito 
CartController.addProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { idProduct, quantity, subtotal, talla } = req.body;

        // Validar ID del carrito
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        // Validaciones del producto
        if (!idProduct || !mongoose.Types.ObjectId.isValid(idProduct)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "La cantidad debe ser al menos 1" });
        }

        if (subtotal === undefined || subtotal < 0) {
            return res.status(400).json({ message: "El subtotal no puede ser negativo" });
        }

        // Validar talla si se proporciona
        if (talla) {
            const validSizes = ['XS', 'S', 'M', 'L', 'XL'];
            if (!validSizes.includes(talla)) {
                return res.status(400).json({ 
                    message: `Talla inválida. Las tallas válidas son: ${validSizes.join(', ')}` 
                });
            }
        }

        // Buscar el carrito
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(
            p => p.idProduct.toString() === idProduct && p.talla === talla
        );

        if (existingProductIndex > -1) {
            // Si existe, actualizar cantidad y subtotal
            cart.products[existingProductIndex].quantity += quantity;
            cart.products[existingProductIndex].subtotal += subtotal;
        } else {
            // Si no existe, agregar nuevo producto
            cart.products.push({
                idProduct,
                quantity,
                subtotal,
                talla
            });
        }

        // Recalcular total
        cart.total = cart.products.reduce((sum, product) => sum + product.subtotal, 0);

        await cart.save();

        // Populate y devolver carrito actualizado
        const populatedCart = await Cart.findById(cart._id)
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category');

        res.status(200).json({
            message: "Producto agregado al carrito exitosamente",
            cart: populatedCart
        });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ 
            message: "Error al agregar producto al carrito", 
            error: error.message 
        });
    }
};

// REMOVE PRODUCT - Remover producto del carrito 
CartController.removeProduct = async (req, res) => {
    try {
        const { id, productId } = req.params;

        // Validar IDs
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        // Buscar el carrito
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Buscar el producto en el carrito
        const productIndex = cart.products.findIndex(
            p => p.idProduct.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        // Remover el producto
        cart.products.splice(productIndex, 1);

        // Recalcular total
        cart.total = cart.products.reduce((sum, product) => sum + product.subtotal, 0);

        await cart.save();

        // Populate y devolver carrito actualizado
        const populatedCart = await Cart.findById(cart._id)
            .populate('idClient', 'name email')
            .populate('products.idProduct', 'name price category');

        res.status(200).json({
            message: "Producto removido del carrito exitosamente",
            cart: populatedCart
        });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ 
            message: "Error al remover producto del carrito", 
            error: error.message 
        });
    }
};

//  DELETE - Eliminar carrito
CartController.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        const deletedCart = await Cart.findByIdAndDelete(id);
        
        if (!deletedCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        res.status(200).json({
            message: "Carrito eliminado exitosamente",
            cart: deletedCart
        });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ 
            message: "Error al eliminar el carrito", 
            error: error.message 
        });
    }
};

//  CLEAR CART - Vaciar carrito 
CartController.clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        const cart = await Cart.findByIdAndUpdate(
            id,
            { 
                products: [], 
                total: 0 
            },
            { new: true }
        )
        .populate('idClient', 'name email');
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        
        res.status(200).json({
            message: "Carrito vaciado exitosamente",
            cart: cart
        });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ 
            message: "Error al vaciar el carrito", 
            error: error.message 
        });
    }
};

//  GET CART STATS - Obtener estadísticas del carrito 
CartController.getCartStats = async (req, res) => {
    try {
        const stats = await Cart.aggregate([
            {
                $group: {
                    _id: null,
                    totalCarts: { $sum: 1 },
                    totalProducts: { $sum: { $size: "$products" } },
                    totalValue: { $sum: "$total" },
                    statusDistribution: {
                        $push: {
                            status: "$status",
                            count: 1
                        }
                    }
                }
            },
            {
                $project: {
                    totalCarts: 1,
                    totalProducts: 1,
                    totalValue: { $round: ["$totalValue", 2] },
                    statusStats: {
                        $arrayToObject: {
                            $map: {
                                input: ["Pending", "Paid"],
                                as: "status",
                                in: {
                                    k: "$$status",
                                    v: {
                                        $size: {
                                            $filter: {
                                                input: "$statusDistribution",
                                                cond: { $eq: ["$$this.status", "$$status"] }
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
                totalCarts: 0,
                totalProducts: 0,
                totalValue: 0,
                statusStats: { Pending: 0, Paid: 0 }
            });
        }

        res.status(200).json(stats[0]);
    } catch (error) {
        console.error("Error fetching cart stats:", error);
        res.status(500).json({ 
            message: "Error al obtener estadísticas del carrito", 
            error: error.message 
        });
    }
};

export default CartController;