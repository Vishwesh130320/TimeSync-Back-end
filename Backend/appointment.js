const mongoose = require("mongoose");
const validator = require("validator");
// Define the appointment schema
const appointmentSchema = new mongoose.Schema({
  clientFirstName: { type: String },
  clientLastName: { type: String },
  clientEmail: {
    type: String,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email",
    },
  },
  status: {
    type: String,
    enum: ["scheduled", "canceled", "completed"],
    default: "scheduled",
  },
  appointmentDate: { type: Date, required: true },
  person: { type: String, required: true },
  appointmentDuration: { type: Number, required: true },
});

//appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
