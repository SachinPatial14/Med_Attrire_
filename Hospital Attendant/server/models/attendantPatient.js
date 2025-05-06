import mongoose from "mongoose";

const attendantPatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientInfo",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
      required: true,
    },
    patientGender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    patientAddress: {
      type: String,
      required: true,
      trim: true,
    },
    patientDisease: {
      type: String,
      required: true,
    },
    patientMedicalHistory: {
      type: String,
      required: true,
      trim: true,
    },
    attendantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const AttendantPatient = mongoose.model("AttendantPatient", attendantPatientSchema);

export default AttendantPatient;
