import { Schema, model} from "mongoose";

const employeeSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email : {
        type: String,
        require: true,
        trim: true
    },
    phoneEmployees: {
        type: String,
        require: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        require: true,
        trim: true
    },
    addressEmployees: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    hireDateEmployee : {
        type: Date,
        require: true,
        trim: true
    },
    duiEmployees : {
        type: String,
        require: true,
        trim: true
    }
}, {
    timestamps: true,
    strict: false
})

export default model('Employees', employeeSchema)