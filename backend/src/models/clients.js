/*
    Campos:
        name,
        email,
        phone,
        dateOfBirth,
        password,
        image
*/

import {Schema, model} from 'mongoose';

const clientSchema = new Schema({
    name:{
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
    phone: {
        type: String,
        require: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        require: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    strict: true
})

export default model('Clients', clientSchema);