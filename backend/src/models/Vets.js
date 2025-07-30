import { Schema, model } from "mongoose";

const vetSchema = new Schema({
    nameVet:{
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    locationVet: {
        type: String,
        require: true,
        trim: true
    },
    nitVet: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
},{
    timestamps: true,
    strict: true
})

export default model('Vet', vetSchema);