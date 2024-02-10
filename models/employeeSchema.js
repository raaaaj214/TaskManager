import e from "express";
import mongoose ,{ Schema } from "mongoose";
import validator from "validator"

const employeeSchema = new Schema({
    profilePicture : {
        type : String,
        required : true,
    },
    firstName :{
        type : String,
        required : true,
        lowercase : true
    },
    lastName :{
        type : String,
        required : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : [validator.isEmail , 'Invalid Email']
    },
    password : {
        type : String,
        required : true
    },

})

export const Employee = mongoose.model("employee" ,employeeSchema);
