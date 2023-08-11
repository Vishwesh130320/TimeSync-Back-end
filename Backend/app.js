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

// Get Free Time Slots for a specific person
// app.get("/free-time-slots/:person", async (req, res) => {
//   try {
//     const { person } = req.params;

//     // Find all appointments for the specified person
//     const appointments = await Appointment.find({ date: appointmentDate }).sort({
//       appointmentDate: 1,
//     });
//     console.log(appointments);
//     }
// Calculate free time slots based on existing appointments
//     const timeSlots = [];
//     if (appointments.length > 0) {
//       // Assume working hours are from 9 AM to 5 PM (adjust as needed)
//       const startTime = moment("09:00:00", "HH:mm:ss");
//       const endTime = moment("17:00:00", "HH:mm:ss");

//       // let prevAppointmentEnd = moment(appointments[0].appointmentDate);

//       //Set that contains all the slots with difference of 30 mins.

//       //Set that contains all the booked appointments.

//       // Checking time slots between appointments
//       for (let i = 0; i < appointments.length; i++) {
//         const currentAppointmentStart = moment(appointmentDate);
//         const availableSlotStart = prevAppointmentEnd;
//         const availableSlotEnd = currentAppointmentStart;

//         if (availableSlotEnd.isAfter(availableSlotStart)) {
//           const durationMinutes = availableSlotEnd.diff(
//             availableSlotStart,
//             "minutes"
//           );
//           if (durationMinutes >= 30) {
//             // If the slot is at least 30 minutes, add it to the list of free time slots
//             timeSlots.push({
//               start: availableSlotStart.toISOString(),
//               end: availableSlotEnd.toISOString(),
//             });
//           }
//         }

//         prevAppointmentEnd = moment(appointments[i].appointmentDate);
//       }

//       // Check time slot after the last appointment
//       const lastAppointmentEnd = moment(
//         appointments[appointments.length - 1].appointmentDate
//       );
//       const availableSlotStart = lastAppointmentEnd;
//       const availableSlotEnd = endTime;

//       if (availableSlotEnd.isAfter(availableSlotStart)) {
//         const durationMinutes = availableSlotEnd.diff(
//           availableSlotStart,
//           "minutes"
//         );
//         if (durationMinutes >= 30) {
//           // If the slot is at least 30 minutes, add it to the list of free time slots
//           timeSlots.push({
//             start: availableSlotStart.toISOString(),
//             end: availableSlotEnd.toISOString(),
//           });
//         }
//       }
//     } else {
//       // If there are no existing appointments, assume the person is available all day
//       const startTime = moment("09:00:00", "HH:mm:ss");
//       const endTime = moment("17:00:00", "HH:mm:ss");

//       // Add the full working hours as the free time slot
//       timeSlots.push({
//         start: startTime.toISOString(),
//         end: endTime.toISOString(),
//       });
//     }

//     res.json(timeSlots);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve free time slots" });
//   }
// });

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
