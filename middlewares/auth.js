import { Company } from "../models/companySchema.js";
import jwt from "jsonwebtoken"
import { Employee } from "../models/employeeSchema.js";

export const companyAuth = async(req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token)
        {
            res.status(401).json({
                message : "You need to login"
            })
        }
    
        const id = jwt.verify(token,process.env.PRIVATE_KEY);
        const user = await Company.findById(id).select("-password -email")
        if(user == null){
            res.json({
                message : "not logged in"
            })
        }
        else
        {
            req.user = user;
            next();
        }
        
    } catch (error) {
        console.log(error)
    }
   
}


export const employeeAuth = async(req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token)
        {
            res.status(401).json({
                message : "You need to login"
            })
        }
    
        const id = jwt.verify(token,process.env.PRIVATE_KEY);
        const user = await Employee.findById(id).select("-password -email")
        if(user == null){
            res.json({
                message : "not logged in"
            })
        }
        else
        {
            req.user = user;
            next();
        }
        
       
    } catch (error) {
        console.log(error)
    }
   
}