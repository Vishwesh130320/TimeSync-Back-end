const mongoose = require("mongoose");
const validator = require("validator");
// Define the appointment schema
const appointmentSchema = new mongoose.Schema({
  clientFirstName: { type: String },
  clientLastName: { type: String },
  clientemail: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
    },
  },
  appointmentDate: { type: Date, required: true },
  appointmentwith: { type: String, required: false },
  appointmentDuration: { type: Number, required: true },
});

//appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
