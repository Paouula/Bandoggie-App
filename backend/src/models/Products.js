import {Schema, model} from "mongoose";

const ProductsSchema = new Schema({
    nameProduct: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    designImages: {
        type: [String],
        validate: [
            {
                validator: function(images) {
                    return images.length >= 3;
                },
                message: 'Se requieren mínimo 3 imágenes de diseño'
            },
            {
                validator: function(images) {
                    return images.length <= 10;
                },
                message: 'Máximo 10 imágenes de diseño permitidas'
            }
        ],
        require: true
    },

    idHolidayProduct: {
        type: Schema.Types.ObjectId,
        ref: "Holiday",
        require: true
    },
    idCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        require: true
    },
}, {
    timestamps: true,
    strict: false
})

export default model("Products", ProductsSchema)