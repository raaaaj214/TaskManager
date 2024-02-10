import e from "express";
import mongoose ,{ Schema, mongo } from "mongoose";
import validator from "validator"

const jobPostSchema = new Schema({
    position :{
        type : String,
        required : true,
    },
    location :{
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    jobType : {
        type : String,
        required : true,
        enum : ['Full-time' , "Part-time" , "Intern"]
    },
    requirements : {
        type : [String],
        required : true
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "company",
        required : true
    },
    companyName : {
        type : String,
        required : true
    },
    vacancies : {
        type : Number,
        required : true
    },
    applications : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "employee",
        default : []
    },
    date : {
        type : Date,
        default : Date.now
    }

})

export const jobPost = mongoose.model("jobPost" ,jobPostSchema);

