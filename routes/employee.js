import express from "express";
import { registerAcc, loginAcc,applyToJob,getjobs,getMe , getOneJob , editProfile } from "../controllers/employee.js";
import multer from "multer";
import { companyAuth, employeeAuth } from "../middlewares/auth.js";

const upload = multer();
const router = express.Router();

// router.get("/" , (req,res)=> res.send("<h1>Employee</h1>"))

router.post("/new" ,upload.single('file') ,registerAcc);
router.post("/login" , loginAcc);
router.get("/applyjob/:id", employeeAuth, applyToJob)
router.get("/getjobs",employeeAuth, getjobs)
router.get("/getonejob/:id",getOneJob)
router.put("/editprofile" , employeeAuth, upload.single('file') , editProfile)
export default router;