import PatientInfo from "../models/patient.js";

export const addPatientInfo = async(req,res)=>{
  try{
const{userId,name,age,disease,gender,address,medicalhistory, assignedDoctor} = req.body ;

if (!userId) {
  return res.status(400).json({ message: "UserId is required" });
};

const existingPatient = await PatientInfo.findOne({ userId });

if (!name && !age && !disease && !gender && !address && !medicalhistory && !assignedDoctor) {
  if (existingPatient) {
    return res.status(200).json({
      message: "Patient Info already exists",
      patientInfo: existingPatient,
    });
  } else {
    return res.status(404).json({ message: "Patient Info not found" });
  }
};

if( !name || !age || !disease || !gender || !address || !medicalhistory || !assignedDoctor){
    return res.status(400).json({message:"All fields are required"});
};

if (existingPatient) {
  return res.status(200).json({
    message: "Patient Info already exists",
    patientInfo: existingPatient,
  });
}


const newPatientInfo = new PatientInfo({
  userId,
  name,
  age,
  disease,
  address,
  medicalhistory,
  gender,
  assignedDoctor,
});

const savedPatientInfo = await newPatientInfo.save();

res.status(201).json({
  message:"Patient Info saved successfully",
  patientInfo : savedPatientInfo,
});

  }catch(error){
      console.error("Error adding patient Info",error);
      res.status(500).json({
         message:"Error adding patient Info",
         error:error.message,
      });
 
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
      const doctorId = req.query.doctorId;
      const patients = await PatientInfo.find({ assignedDoctor: doctorId });
      res.json(patients);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching patients' });
  }
};
