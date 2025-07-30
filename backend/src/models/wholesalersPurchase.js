import { Schema, model } from "mongoose";

const guestWholesalersSchema = new Schema(
    {
        emailGuestWholesalers: {
            type: String,
            required: true,
            minLength: 4,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un correo electrónico válido']
        },
        nameGuestWholesalers: {
            type: String,
            required: true,
            minLength: 2,
            trim: true
        },
        lastNameGuestWholesalers: {
            type: String,
            required: true,
            minLength: 2,
            trim: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true,
        strict: false
    }
);

export default model("GuestWholesalers", guestWholesalersSchema);