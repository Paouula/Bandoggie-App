import { Schema, model } from "mongoose";

const ReviewsSchema = new Schema({
  qualification: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },

  designImages: {
    type: [String],
    validate: [
      {
        validator: function (images) {
          // Si no se envían imágenes, no valida (lo permite)
          if (!images || images.length === 0) return true;
          return images.length >= 3;
        },
        message: "Se requieren mínimo 3 imágenes de diseño si se incluyen"
      },
      {
        validator: function (images) {
          if (!images || images.length === 0) return true;
          return images.length <= 5;
        },
        message: "Máximo 5 imágenes de diseño permitidas"
      }
    ]
  },

  idClient: {
    type: Schema.Types.ObjectId,
    ref: "Clients",
    required: true
  },
  idProduct: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true
  }
}, {
  timestamps: true,
  strict: false
});

export default model("Reviews", ReviewsSchema);
