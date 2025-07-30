import ordersModel from "../models/orders.js";
import mongoose from "mongoose";

const ordersController = {};

// SELECT - Obtener todas las órdenes
ordersController.getOrders = async (req, res) => {
  try {
    const orders = await ordersModel.find()
      .populate('idCart', 'products totalAmount')
      .sort({ createdAt: -1 }); // Ordenar por más recientes
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      message: "Error al obtener las órdenes", 
      error: error.message 
    });
  }
};

// SELECT BY ID - Obtener orden por ID 
ordersController.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de orden inválido" });
    }

    const order = await ordersModel.findById(id)
      .populate('idCart', 'products totalAmount');
    
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ 
      message: "Error al obtener la orden", 
      error: error.message 
    });
  }
};

//  INSERT - Crear nueva orden 
ordersController.createOrder = async (req, res) => {
  try {
    const { idCart, addressClient, PaymentMethod } = req.body;

    // Validaciones de campos requeridos
    if (!idCart) {
      return res.status(400).json({ message: "El ID del carrito es requerido" });
    }

    if (!addressClient || !addressClient.trim()) {
      return res.status(400).json({ message: "La dirección del cliente es requerida" });
    }

    if (!PaymentMethod) {
      return res.status(400).json({ message: "El método de pago es requerido" });
    }

    // Validar método de pago (solo transferencia o efectivo)
    const validPaymentMethods = ['transferencia', 'efectivo'];
    if (!validPaymentMethods.includes(PaymentMethod.toLowerCase())) {
      return res.status(400).json({ 
        message: "Método de pago inválido. Solo se acepta 'transferencia' o 'efectivo'" 
      });
    }

    // Validar que el ID del carrito sea válido
    if (!mongoose.Types.ObjectId.isValid(idCart)) {
      return res.status(400).json({ message: "ID del carrito inválido" });
    }

    // Verificar que el carrito existe (opcional, dependiendo de tu lógica)
    const cartExists = await cartModel.findById(idCart);
    if (!cartExists) {
    return res.status(404).json({ message: "Carrito no encontrado" });
     }

    // Crear nueva orden
    const newOrder = new ordersModel({ 
      idCart, 
      addressClient: addressClient.trim(), 
      PaymentMethod: PaymentMethod.toLowerCase()
    });
    
    await newOrder.save();

    // Popultar la orden recién creada antes de responder
    const populatedOrder = await ordersModel.findById(newOrder._id)
      .populate('idCart', 'products totalAmount');

    res.status(201).json({ 
      message: "Orden creada exitosamente", 
      order: populatedOrder 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      message: "Error al crear la orden", 
      error: error.message 
    });
  }
};

// UPDATE - Actualizar orden 
ordersController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { idCart, addressClient, PaymentMethod } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de orden inválido" });
    }

    // Verificar que la orden existe
    const existingOrder = await ordersModel.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    // Validar método de pago si se proporciona
    if (PaymentMethod) {
      const validPaymentMethods = ['transferencia', 'efectivo'];
      if (!validPaymentMethods.includes(PaymentMethod.toLowerCase())) {
        return res.status(400).json({ 
          message: "Método de pago inválido. Solo se acepta 'transferencia' o 'efectivo'" 
        });
      }
    }

    // Validar ID del carrito si se proporciona
    if (idCart && !mongoose.Types.ObjectId.isValid(idCart)) {
      return res.status(400).json({ message: "ID del carrito inválido" });
    }

    // Validar dirección si se proporciona
    if (addressClient && !addressClient.trim()) {
      return res.status(400).json({ message: "La dirección del cliente no puede estar vacía" });
    }

    // Preparar datos para actualización
    const updateData = {};
    if (idCart) updateData.idCart = idCart;
    if (addressClient) updateData.addressClient = addressClient.trim();
    if (PaymentMethod) updateData.PaymentMethod = PaymentMethod.toLowerCase();

    // Verificar que hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
    }

    // Actualizar orden
    const updatedOrder = await ordersModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('idCart', 'products totalAmount');

    res.status(200).json({ 
      message: "Orden actualizada exitosamente", 
      order: updatedOrder 
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ 
      message: "Error al actualizar la orden", 
      error: error.message 
    });
  }
};

//  DELETE - Eliminar orden 
ordersController.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de orden inválido" });
    }

    const deletedOrder = await ordersModel.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    
    res.status(200).json({ 
      message: "Orden eliminada exitosamente",
      order: deletedOrder
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ 
      message: "Error al eliminar la orden", 
      error: error.message 
    });
  }
};

//  SELECT BY PAYMENT METHOD - Obtener órdenes por método de pago
ordersController.getOrdersByPaymentMethod = async (req, res) => {
  try {
    const { paymentMethod } = req.params;

    // Validar que se proporcione el método de pago
    if (!paymentMethod) {
      return res.status(400).json({ message: "El método de pago es requerido" });
    }

    // Validar método de pago
    const validPaymentMethods = ['transferencia', 'efectivo'];
    if (!validPaymentMethods.includes(paymentMethod.toLowerCase())) {
      return res.status(400).json({ 
        message: "Método de pago inválido. Solo se acepta 'transferencia' o 'efectivo'" 
      });
    }

    const orders = await ordersModel.find({ 
      PaymentMethod: paymentMethod.toLowerCase() 
    })
    .populate('idCart', 'products totalAmount')
    .sort({ createdAt: -1 });

    // Si no hay órdenes, devolver array vacío con 200
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by payment method:", error);
    res.status(500).json({ 
      message: "Error al obtener órdenes por método de pago", 
      error: error.message 
    });
  }
};

//  SELECT BY DATE RANGE - Obtener órdenes por rango de fechas 
ordersController.getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validar que se proporcionen ambas fechas
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Se requieren las fechas de inicio y fin (startDate, endDate)" 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validar que las fechas sean válidas
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Formato de fecha inválido. Use formato YYYY-MM-DD" });
    }

    // Validar que la fecha de inicio no sea mayor que la de fin
    if (start > end) {
      return res.status(400).json({ 
        message: "La fecha de inicio no puede ser mayor que la fecha de fin" 
      });
    }

    // Validar que las fechas no sean futuras (opcional)
    const now = new Date();
    if (start > now || end > now) {
      return res.status(400).json({ 
        message: "No se pueden consultar fechas futuras" 
      });
    }

    const orders = await ordersModel.find({
      createdAt: {
        $gte: start,
        $lte: end
      }
    })
    .populate('idCart', 'products totalAmount')
    .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    res.status(500).json({ 
      message: "Error al obtener órdenes por rango de fechas", 
      error: error.message 
    });
  }
};

// STATISTICS - Obtener estadísticas de órdenes 
ordersController.getOrdersStats = async (req, res) => {
  try {
    const stats = await ordersModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          ordersByPaymentMethod: {
            $push: {
              paymentMethod: "$PaymentMethod",
              count: 1
            }
          }
        }
      },
      {
        $project: {
          totalOrders: 1,
          paymentMethodStats: {
            $arrayToObject: {
              $map: {
                input: ["transferencia", "efectivo"],
                as: "method",
                in: {
                  k: "$method",
                  v: {
                    $size: {
                      $filter: {
                        input: "$ordersByPaymentMethod",
                        cond: { $eq: ["$this.paymentMethod", "$method"] }
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

    // Si no hay órdenes, devolver estadísticas vacías
    if (stats.length === 0) {
      return res.status(200).json({
        totalOrders: 0,
        paymentMethodStats: { transferencia: 0, efectivo: 0 }
      });
    }

    res.status(200).json(stats[0]);
  } catch (error) {
    console.error("Error fetching orders stats:", error);
    res.status(500).json({ 
      message: "Error al obtener estadísticas de órdenes", 
      error: error.message 
    });
  }
};

export default ordersController;