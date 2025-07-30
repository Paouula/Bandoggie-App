/**
  Campos:
    idClient
    products
      idProduct
      quantity
      subtotal
    talla
    total
    status
*/

import { Schema, model } from "mongoose";

const CartSchema = new Schema({
  idClient: {
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required: true
  },

  products: [
    {
      idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true
      },
      quantity: {
        type: Number,
        min: [1, "La cantidad debe ser al menos 1"],
        required: true
      },
      subtotal: {
        type: Number,
        min: [0, "El subtotal no puede ser negativo"],
        required: true
      },
      talla: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL']
      }
    }
  ],

  total: {
    type: Number,
    required: true,
    min: [0, "El total no puede ser negativo"]
  },

  status: {
    type: String,
    enum: {
      values: ["Pending", "Paid"],
      message: "El estado del pedido debe ser 'Pending' o 'Paid'"
    },
    default: "Pending"
  }
}, {
  timestamps: true
});

export default model("Cart", CartSchema);
