import {Schema, model} from "mongoose";

const HolidaysSchema = new Schema({
    nameHoliday: {
        type: String,
        require: true
    },
}, {
    timestamps: true,
    strict: false
})

export default model("Holidays", HolidaysSchema)