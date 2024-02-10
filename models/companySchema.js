import e from "express";
import mongoose ,{ Schema } from "mongoose";
import validator from "validator"

const companySchema = new Schema({
    logo : {
        type : String,
        required : true,
    },
    name :{
        type : String,
        required : true,
        lowercase : true
    },
    description :{
        type : String,
        required : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        validate : [validator.isEmail , 'Invalid Email'],
        unique : true
    },
    password : {
        type : String,
        required : true
    },

})

export const Company = mongoose.model("company", companySchema);
