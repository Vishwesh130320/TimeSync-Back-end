// const mongoose = require("mongoose");
// const validator = require("validator");
// // Define the appointment schema
// const appointmentSchema = new mongoose.Schema({
//   doctorName: { type: String },
//   patientEmail: {
//     type: String,
//     validate: {
//       validator: function (value) {
//         return validator.isEmail(value);
//       },
//       message: "{VALUE} is not a valid email",
//     },
//   },
//   status: {
//     type: String,
//     enum: ["Scheduled", "Canceled", "Completed"],
//     default: "Scheduled",
//   },
//   appointmentDate: { type: Date, required: true },
//   patientName: { type: String, required: true },
//   durationInMinutes: { type: Number, required: true },
//   location: {
//     type: String,
//   },
//   notes: {
//     type: String,
//   },
// });

// const Appointment = mongoose.model("Appointment", appointmentSchema);

// module.exports = Appointment;

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  // doctorId: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // patientId: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["Scheduled", "Canceled", "Completed"],
    default: "Scheduled",
  },
  appointmentDate: { type: Date, required: true },
  durationInMinutes: { type: Number, required: true },
  location: { type: String },
  notes: { type: String },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
