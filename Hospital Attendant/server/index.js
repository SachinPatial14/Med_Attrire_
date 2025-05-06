import express from "express" ;
import mongoose from "mongoose" ;
import cors from "cors" ;
import {fileURLToPath} from "url";
import path from "path" ;
import { createUser, getAttendants, getDoctors, loginUser, userRole } from "./controllers/user.js";
import { addPatientInfo, getDoctorPatients} from "./controllers/patient.js";
import { assignTaskToAttendant, getAttendantPatients } from "./controllers/attendantPatients.js";
import { getChat, postChat } from "./controllers/chat.js";

const app = express() ;
app.use(express.json());
app.use(cors()) ;

const __filename = fileURLToPath(import.meta.url) ;
const __dirname = path.dirname(__filename) ;

const PORT = 7071 ;
const mongo_url = "mongodb://localhost:27017/hospitalAttended" ;

if(!mongo_url){
    console.error("The database is not connected successfully, please recheck the url in env file and try again!!")
    process.exit(1) ;
}

mongoose.connect(mongo_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("The database has been connected successfully!!");
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`);
    });
}).catch((error)=>{
  console.error("Something went wrong while connecting to database",error);
});

app.post("/createAccount",createUser);

app.post("/loginUser",loginUser);

app.put("/userRole/:id",userRole);

app.post("/addPatientInfo",addPatientInfo);

app.get("/getDoctors",getDoctors);

app.get("/getDoctorPatients", getDoctorPatients);

app.get("/getAttendants",getAttendants);

app.post("/assignTaskToAttendant",assignTaskToAttendant);

app.get("/getAttendantPatients",getAttendantPatients);

app.post("/postChat",postChat);

app.get("/getChat",getChat);