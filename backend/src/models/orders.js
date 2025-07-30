/*
    Campos:
        idClients,
        listProducts,
        dateOrders,
        idProduct,
        addressClient,
        subTotal,
        total
*/

import {Schema, model} from "mongoose";

const OrdersSchema = new Schema({

    idCart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        require: true
    },

    addressClient: {
        type: String,
        require: true
    },

    paymentMethod: {
        type: String,
        require: true,
        enum: ["transferencia", "efectivo"]
    },


    
}, {
    timestamps: true,
    strict: false
})

export default model("Orders", OrdersSchema)