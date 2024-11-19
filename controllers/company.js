import { Company } from "../models/companySchema.js";
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { jobPost } from "../models/jobPostSchema.js";
import { Employee } from "../models/employeeSchema.js";

export const registerAcc = async(req,res) => {
    try {
        const {name, description , email, password} = req.body;
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

          const newUser = await Company.create({
            logo : imageUrl,
            name : name,
            description : description,
            email : email,
            password : hashPassword
          })
          newUser.save();
          res. status(201).json({
            success : true,
            message : "A new company account has been created"
          })
        }
    } catch (error) {
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
        const {email,password} = req.body;
        const userData = await Company.findOne({
            email : email
        })
        if(!userData)
        {
            return res.status(404).json({
                message : "Incorrect email"
            })
        }
        else
        {
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
        
    }catch (error) {
        console.error(error)
        res.json({
            err : error
        })
    }
        
    }

export const createJobPost = async (req,res) => {
    try {
        const {position,location,description,jobType,requirements,vacancies} = req.body

        const jobData = await jobPost.find({
            position : position,
            location : location,
            companyId : req.user._id
        })
        if(jobData.length == 0)
        {
            const job = await jobPost.create({
                position : position,
                location : location,
                description : description,
                jobType : jobType,
                requirements : requirements,
                vacancies : vacancies,
                companyId : req.user._id,
                companyName : req.user.name,
            })
    
            job.save();
    
            res.status(201).json({
                success : true,
                message : "Job posted"
            })
        }
        else{
            res.json({
                success : false,
                message : "Job already exists"
            })
        }
       
        
    } catch (error) {
        console.error(error)
    }
}


export const updatePost = async(req,res) => {
    try {
        const {position,location,description,jobType,requirements,vacancies} = req.body
        const id = req.params.id;
        if(!id){
            res.status(404).json({
                message : "Post not found"
            })
        }

        const job = await jobPost.findOneAndUpdate({
            _id : id
        },{
            position : position,
            location : location,
            description : description,
            jobType : jobType,
            requirements : requirements,
            vacancies : vacancies
        })

        res.status(200).json({
            message : "Post updated"
        })
    } catch (error) {
        console.error(error)
    }
}


export const deletePost = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id){
            res.status(404).json({
                success : false,
                message : "Post not found"
            })
        }
        const job = await jobPost.findOneAndDelete({
            _id : id
        }) 
        res.status(200).json({
            success : true,
            message : "Post deleted"
        })
    } catch (error) {
        console.error(error)
    }

}

export const getAllJobs = async(req,res) => {
    try {
        const {_id} = req.user

        const jobs = await jobPost.find({
            companyId : _id
        }).populate("applications" , "firstName lastName email")
        res.json({
            message : "Jobs fetched",
            count : jobs.length,
            jobs
        })
    } catch (error) {
        console.error(error)
    }
   
}

export const getApplicants = async (req , res) => {

    try {
        const {id} = req.params;

    const {applications} = await jobPost.findOne({
        _id : id    
    }).populate({
        path : "applications",
        select : "profilePicture firstName lastName email"
    })

    res.json({
        message : "Applications fetched successfully",
        count : applications.length,
        applications
    })
    } catch (error) {
        console.error(error)
    }
    
}

export const getCompany = async (req,res) =>{
    try {
        const {id} = req.params

        const companyData = await Company.findOne({
            _id : id
        }).select("-password")

        res.status(200).json({
            message : "Fetched Data",
            company : companyData
        })
    } catch (error) {
        console.error(error)
    }
}

export const editProfile = async (req,res) => {
    try {
       const {name, description , email} = req.body

       if(req.file)
       {

       const b64 = Buffer.from(req.file.buffer).toString("base64");
       let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

   
       const result = await cloudinary.uploader.upload(dataURI, {
       resource_type: 'auto',
     });

     // You can save the Cloudinary URL or do further processing as needed
     const imageUrl = result.secure_url;
     const newUser = await Company.findByIdAndUpdate(req.user._id,{
        logo : imageUrl,
        name : name,
        description : description,
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
        const newUser = await Company.findByIdAndUpdate(req.user._id , {
        name : name,
        description : description,
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