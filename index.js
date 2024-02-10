import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import config from "./middlewares/cloudinary.js";
import dotenv from "dotenv"
import mongoose from "mongoose";
import employeeRouter from "./routes/employee.js"
import companyRouter from "./routes/company.js"
import commonRouter from "./routes/common.js"

          

const app = express();

// middlewares
config();
dotenv.config();
app.use(cors({
    origin : "http://localhost:3000",
    methods : ["GET","POST","PUT","PATCH","DELETE"],
    credentials : true,
}))
app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use(express.json());

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

// app.get("/" , async(req,res) => {
//     try {
//         const newEmp = await Employee.create({profilePicture : "raj", firstName:"Raj",lastName:"Deshmukh",email:"raj@gmail.com",password:"raj"});
//     newEmp.save();
//     res.json({
//         emp : newEmp
//     })
//     } catch (error) {
//         console.log(error);
//         res.json({
//             error : error
//         })
//     }
// })

//routes
app.use("/user" , employeeRouter);
app.use("/company" , companyRouter);
app.use("/common" , commonRouter)

app.listen(4000 , ()=> console.log("Server Started"))
mongoose.connect(process.env.MONGODB_URI, {
    dbName : "job-board-app"
}).then(() => console.log("Database Started")).catch((err) => console.log(err))