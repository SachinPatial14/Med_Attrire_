import AttendantPatient from "../models/attendantPatient.js";

export const assignTaskToAttendant = async(req,res)=>{
    try {
        const {
          patientId,
          patientName,
          patientAge,
          patientGender,
          patientAddress,
          patientDisease,
          patientMedicalHistory,
          attendantId,
          doctorId,
        } = req.body;
    
        // Validate required fields
        if (
          !patientId ||
          !patientName ||
          !patientAge ||
          !patientGender ||
          !attendantId ||
          !doctorId
        ) {
          return res.status(400).json({
            success: false,
            message: "Missing required fields",
          });
        }
    
        // Create a new assignment document
        const newAssignment = await AttendantPatient.create({
          patientId,
          patientName,
          patientAge,
          patientGender,
          patientAddress,
          patientDisease,
          patientMedicalHistory,
          attendantId,
          doctorId,
        });
    
        res.status(200).json({
          success: true,
          message: "Task assigned to attendant successfully",
          assignment: newAssignment,
        });
      } catch (error) {
        console.error("Error assigning task:", error);
        res.status(500).json({
          success: false,
          message: "Error assigning task to attendant",
          error: error.message,
        });
      }
};

export const getAttendantPatients = async(req,res) =>{
  const { attendantId } = req.query;
  if (!attendantId) {
    return res.status(400).json({ message: "Attendant ID is required" });
  }
  try {
    const patients = await AttendantPatient.find({ attendantId });
    return res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching attendant patients:", error);
    return res.status(500).json({ message: error.message });
  }
} 