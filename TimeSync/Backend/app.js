const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("./appointment");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
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
      person,
      appointmentDuration,
      status,
    } = req.body;

    if (
      !clientFirstName ||
      !clientLastName ||
      !clientEmail ||
      !appointmentDuration ||
      !person
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
      person,
      appointmentDuration,
      status,
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// Get all Appointments
app.get("/appointment", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

//Update Appointment details
app.put("/appointment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientFirstName,
      clientLastName,
      appointmentDate,
      clientEmail,
      person,
      appointmentDuration,
      status,
    } = req.body;

    // Find the appointment by its ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.clientFirstName =
      clientFirstName || appointment.clientFirstName;
    appointment.clientLastName = clientLastName || appointment.clientLastName;
    appointment.clientEmail = clientEmail || appointment.clientEmail;
    appointment.appointmentDate =
      appointmentDate || appointment.appointmentDate;
    appointment.person = person || appointment.person;
    appointment.appointmentDuration =
      appointmentDuration || appointment.appointmentDuration;

    if (status === "canceled") {
      appointment.status = "canceled";
    }
    // Save the updated appointment
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

app.get("/free-time-slots/:date", async (req, res) => {
  try {
    const { date } = req.params;
    console.log(req.params);
    // Find all appointments

    const startTime = moment(date).utc().set("hour", "09").set("minute", "00");
    const endTime = moment(date).utc().set("hour", "17").set("minute", "00");
    console.log(startTime.toDate(), endTime.toDate());
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: startTime.toDate(),
        $lte: endTime.toDate(),
      },
    }).sort({
      appointmentDate: 1,
    });

    //Set that contains all the slots with difference of 30 mins.
    const allTimeSlots = new Set();

    // Calculate diff

    let currentTimeSlot = startTime.clone();
    while (currentTimeSlot.isSameOrBefore(endTime)) {
      allTimeSlots.add(currentTimeSlot.toISOString());
      currentTimeSlot.add(30, "minutes");
    }

    console.log("appointments", appointments);

    //Set that contains all the booked appointments.
    const bookedAppointments = new Set();
    for (const appointment of appointments) {
      bookedAppointments.add(moment(appointment.appointmentDate).toISOString());
    }

    // Calculate free time slots
    const freeTimeSlots = [...allTimeSlots].filter(
      (slot) => !bookedAppointments.has(slot)
    );

    res.json(freeTimeSlots);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve free time slots" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
