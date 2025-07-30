import { Schema, model } from "mongoose";

const guestClientsSchema = new Schema(
    {
        emailGuestClients: {
            type: String,
            required: true,
            minLength: 4,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        nameGuestClients: {
            type: String,
            required: true,
            minLength: 2,
            trim: true
        },
        lastNameGuestClients: {
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

export default model("GuestClients", guestClientsSchema);