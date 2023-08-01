const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("./appointment");
const app = express();
const bodyParser = require("body-parser");
const mongoDBConnectionString =
  "mongodb+srv://vishweshshah:1234@cluster0.lx1ltgv.mongodb.net/AppointementsDB?retryWrites=true&w=majority";
mongoose.connect(mongoDBConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
console.log("app is working");
app.post("/appointment", async (req, res) => {
  console.log("post req!", req.body);
  try {
    const {
      clientFirstName,
      clientLastName,
      clientEmail,
      appointmentDate,
      appointmentwith,
      appointmentDuration,
    } = req.body;

    if (
      !clientFirstName ||
      !clientLastName ||
      clientEmail ||
      !appointmentwith ||
      !appointmentDuration
    ) {
      return res
        .status(400)
        .json({ error: "Client name and appointment date are required." });
    }

    // Create the appointment using the Appointment model
    const appointment = await Appointment.create({
      clientFirstName,
      clientLastName,
      clientEmail,
      appointmentDate,
      appointmentwith,
      appointmentDuration,
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// Retrieve all appointments
app.get("/appointment", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
