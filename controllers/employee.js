import { Employee } from "../models/employeeSchema.js";
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { jobPost } from "../models/jobPostSchema.js";
import escapeStringRegexp from 'escape-string-regexp'


export const registerAcc = async(req,res) => {
    try {
        const {firstName, lastName , email, password} = req.body;
        const checkUser = await Employee.findOne({email : email})
        if(checkUser)
        {
            res.json({
                success : false,
                message : 'User already exists'
            })
        }
        else
        {
            const hashPassword = await bcrypt.hash(password,10);

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        
            const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
          });

          // You can save the Cloudinary URL or do further processing as needed
          const imageUrl = result.secure_url;

          const newUser = await Employee.create({
            profilePicture : imageUrl,
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : hashPassword
          })
          newUser.save();
          res. status(201).json({
            success : true,
            message : "A new account has been created"
          })
        }
    }
     catch (error) {
        console.error(error)
        res.json({
            success : false,
            message : "Something went wrong",
            err : error
        })
    }
    
}

export const loginAcc = async(req,res) => {
    try {
        const {token} = req.cookies;
        if(!token){
        const {email,password} = req.body;
        const userData = await Employee.findOne({
            email : email
        })
        if(!userData)
        {
            return res.status(404).json({
                message : "Incorrect email"
            })
        }
        const result = await bcrypt.compare(password , userData.password)
        if(result == false)
        {
            return res.status(404).json({
                message : "Incorrect password"
            })
        }else
        {
            const token = jwt.sign(userData._id.toString() , process.env.PRIVATE_KEY);
            res.cookie("token" , token , {
                expires : new Date(Date.now() + 99999999999999)
            })

            res.status(200).json({
                success : "true",
                message : "logged in successfuly"
            })
        }
    }
    else
    {
        res.json({
            success : "false",
            message : "already logged in"
        })
    }
    }catch (error) {
        console.error(error)
        res.json({
            err : error
        })
    }
        
    }

export const applyToJob = async (req,res) => {
    try {
        const {id} = req.params;

        const {applications} = await jobPost.findOne({
            _id : id    
        })
        if(applications.includes(req.user._id))
        {
             res.status(409).json({
                success : false,
                message : "Already applied"
            })
        }
        else{
            const job = await jobPost.findOne({
                _id : id
            })
        
            job.applications.push(req.user._id);
            job.save();
            res.json({
                success : true,
                message : "Applied to job successfully"
            })
        }
    
    } catch (error) {
        console.error(error)
    }
    
}

export const getjobs = async(req,res) => {
    try {
        if(Object.keys(req.query).length == 0)
    {
        const jobs = await jobPost.find()
    res.json({
        message : "Data fetched",
        count : jobs.length,
        jobs
    })
    }
    else
    {
        const {search} = req.query
        let regeExSearch = ""
        if(search){
         regeExSearch = new RegExp(escapeStringRegexp(search) , 'gi')
        }
        const jobs = await jobPost.find({
            $or : [
                { position : { $regex : regeExSearch}},
                { location : { $regex : regeExSearch}}
            ]
        }).select("-applications -date")

        res.json({
            message : "Data fetched",
            count : jobs.length,
            jobs
        })
    }
    
    } catch (error) {
        console.error(error)
    }
    
}

export const getMe = async (req,res) => {
    try {
        const user = req.user;
        res.json({
            success : true,
            user 
        })
    } catch (error) {
        console.error(error)
    }
}

export const getOneJob = async (req,res) => {
    try {
        const {id} = req.params;

        const jobData = await jobPost.findOne({
            _id : id
        }).populate('companyId' , 'logo name description')
        res.json({
            success : true,
            jobData
        })
    } catch (error) {
        console.error(error)
    }
 
}

export const editProfile = async (req,res) => {
    try {
       const {firstName, lastName , email} = req.body

       if(req.file)
       {
       const b64 = Buffer.from(req.file.buffer).toString("base64");
       let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

   
       const result = await cloudinary.uploader.upload(dataURI, {
       resource_type: 'auto',
     });

     // You can save the Cloudinary URL or do further processing as needed
     const imageUrl = result.secure_url;
     const newUser = await Employee.findByIdAndUpdate(req.user._id,{
        profilePicture : imageUrl,
        firstName : firstName,
        lastName : lastName,
        email : email,
      })
      await newUser.save();
      res.json({
        success : true,
        message : "Profile updated"
      })
    }
    else
    {
        const newUser = await Employee.findByIdAndUpdate(req.user._id , {
        firstName : firstName,
        lastName : lastName,
        email : email,
        })
          await newUser.save();
          res.json({
            success : true,
            message : "Profile updated"
          })
    }

    } catch (error) {
        console.error(error)
        res.json({
            success : false,
            message : "Something went wrong",
            error
        })
    }
}