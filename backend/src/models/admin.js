/*
    Campos:
        nameAdmin,
        emailAdmin,
        phoneAdmin,
        dateOfBirth,
        addressAdmin,
        passwordAdmin
*/

import { Schema, model} from "mongoose";

const adminSchema = new Schema({
    nameAdmin: {
        type: String,
        require: true,
        trim: true
    },
    emailAdmin: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    phoneAdmin: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        require: true,
        trim: true
    },
    addressAdmin: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }
}, {
    timestamps: true,
    strict: false
})

export default model('Admin', adminSchema)