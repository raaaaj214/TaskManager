import express from "express"
import jwt from "jsonwebtoken"
import { Employee } from "../models/employeeSchema.js";
import { Company } from "../models/companySchema.js";

const router = express.Router();

router.get("/me", async(req,res) => {
    try {
        const {token} = req.cookies
        if(!token){
            res.status(404).json({
                status : false,
                message : "Not logged in"
            })
        }
        else
        {
            const id = jwt.verify(token,process.env.PRIVATE_KEY)
    
            let user = await Employee.findById(id).select("-password")
            if(user != null){
                res.json({
                    success : true,
                    type : "employee",
                    user
                 })
            }
            else
            {
                user = await Company.findById(id).select("-password ")
                res.json({
                    success : true,
                    type : "company",
                    user
                })
            } 
    
            
        }
    } catch (error) {
        console.log(error)
    }
   
})

router.get("/allcompanies" , async(req,res) => {
    try {
        const companies = await Company.find().select("-email -password");
        res.json({
            success : true,
            message : "Data fetched",
            companies
        })
    } catch (error) {
        console.log(error)
    }
});

router.get("/logout" , async (req,res) => {
    try {
        const {token} = await req.cookies
        if(!token){
            res.json({
                success : false,
                message : "Token doesn't exist"
            })
        }
        else
        {
             res.cookie("token" , null , {
                maxAge : 0
            })
            res.json({
                success : true,
                message : "Logged out"
            })
        }

    } catch (error) {
        console.log(error)
    }
})
export default router;