import express from "express";
import multer from "multer";
import { createJobPost, loginAcc, registerAcc , updatePost , deletePost, getAllJobs, getApplicants,getCompany , editProfile} from "../controllers/company.js";
import { companyAuth } from "../middlewares/auth.js";


const upload = multer();
const router = express.Router();

router.post("/new" , upload.single('file') , registerAcc);
router.post("/login" , loginAcc);
router.post("/newjobpost", companyAuth, createJobPost)
router.patch("/updatejobpost/:id",companyAuth, updatePost)
router.delete("/deletejobpost/:id",companyAuth, deletePost)
router.get("/getalljobposts" , companyAuth , getAllJobs)
router.get("/getapplicants/:id" , companyAuth , getApplicants)
router.put("/editprofile", upload.single('file') , companyAuth , editProfile)

export default router;