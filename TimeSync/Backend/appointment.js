const mongoose = require("mongoose");
const validator = require("validator");

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "canceled", "completed"],
    default: "scheduled",
  },
  location: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
