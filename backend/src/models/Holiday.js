import {Schema, model} from "mongoose";

const HolidaysSchema = new Schema({
    name: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    strict: false
})

export default model("Holidays", HolidaysSchema)