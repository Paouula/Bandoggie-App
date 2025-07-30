import { Schema, model } from "mongoose";

const CategoriasSchema = new Schema(
  {
    nameCategory: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Categorias", CategoriasSchema);