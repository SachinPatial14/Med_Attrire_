import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User" ,
        required : true ,
    },
    name:{
        type:String ,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Other"],
    },
    address:{
        type:String,
        required:true,
        trim:true,
    },
    disease:{
        type:String,
        required:true,
    },
    medicalhistory:{
        type:String,
        required:true,
        trim:true,
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, 
      },
    },
    {timestamps:true}
);

const PatientInfo = mongoose.model("PatientInfo",patientSchema);

export default PatientInfo ;