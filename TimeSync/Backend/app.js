// const express = require("express");
// const mongoose = require("mongoose");
// const Appointment = require("./appointment");
// const app = express();
// const bodyParser = require("body-parser");
// const moment = require("moment");
// const mongoDBConnectionString =
// "mongodb+srv://vishweshshah:1234@cluster0.lx1ltgv.mongodb.net/AppointementsDB?retryWrites=true&w=majority";
// mongoose.connect(mongoDBConnectionString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use(express.json());
// console.log("app is working");

// app.post("/appointment", async (req, res) => {
//   console.log("post req!", req.body);
//   try {
//     const {
//       doctorName,
//       patientEmail,
//       appointmentDate,
//       patientName,
//       durationInMinutes,
//       status,
//       // location,
//     } = req.body;

//     if (
//       !doctorName ||
//       !patientEmail ||
//       !durationInMinutes ||
//       !patientName
//       // !location
//     ) {
//       console.log("ERROR");
//       return res
//         .status(400)
//         .json({ error: "Client name and appointment date are required." });
//     }
//     console.log("NO ERROR");
//     // Create the appointment using the Appointment model
//     const appointment = await Appointment.create({
//       doctorName,
//       patientEmail,
//       appointmentDate,
//       patientName,
//       durationInMinutes,
//       status,
//       // location,
//     });
//     console.log("SAVED");
//     res.status(201).json(appointment);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to create appointment" });
//   }
// });

// // Get all Appointments
// app.get("/appointment", async (req, res) => {
//   try {
//     const appointments = await Appointment.find();
//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch appointments" });
//   }
// });

// //Update Appointment details
// app.put("/appointment/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       doctorName,
//       appointmentDate,
//       patientEmail,
//       patientName,
//       durationInMinutes,
//       status,
//       // location,
//     } = req.body;

//     // Find the appointment by its ID
//     const appointment = await Appointment.findById(id);

//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     appointment.doctorName = doctorName || appointment.doctorName;
//     appointment.patientEmail = patientEmail || appointment.patientEmail;
//     appointment.appointmentDate =
//       appointmentDate || appointment.appointmentDate;
//     appointment.patientName = patientName || appointment.patientName;
//     appointment.durationInMinutes =
//       durationInMinutes || appointment.durationInMinutes;

//     // appointment.location = appointment.location || location;

//     if (status === "Canceled") {
//       appointment.status = "Canceled";
//     }
//     // Save the updated appointment
//     await appointment.save();

//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update appointment" });
//   }
// });

// app.get("/free-time-slots/:date", async (req, res) => {
//   try {
//     const { date } = req.params;
//     console.log(req.params);
//     // Find all appointments

//     const startTime = moment(date).utc().set("hour", "09").set("minute", "00");
//     const endTime = moment(date).utc().set("hour", "17").set("minute", "00");
//     console.log(startTime.toDate(), endTime.toDate());
//     const appointments = await Appointment.find({
//       appointmentDate: {
//         $gte: startTime.toDate(),
//         $lte: endTime.toDate(),
//       },
//     }).sort({
//       appointmentDate: 1,
//     });

//     //Set that contains all the slots with difference of 30 mins.
//     const allTimeSlots = new Set();

//     // Calculate diff

//     let currentTimeSlot = startTime.clone();
//     while (currentTimeSlot.isSameOrBefore(endTime)) {
//       allTimeSlots.add(currentTimeSlot.toISOString());
//       currentTimeSlot.add(30, "minutes");
//     }

//     console.log("appointments", appointments);

//     //Set that contains all the booked appointments.
//     const bookedAppointments = new Set();
//     for (const appointment of appointments) {
//       bookedAppointments.add(moment(appointment.appointmentDate).toISOString());
//     }

//     // Calculate free time slots
//     const freeTimeSlots = [...allTimeSlots].filter(
//       (slot) => !bookedAppointments.has(slot)
//     );

//     res.json(freeTimeSlots);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to retrieve free time slots" });
//   }
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/routes/userRoutes.js");
const appointment = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/routes/appointmentRoutes.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mongoDBConnectionString =
  "mongodb+srv://vishweshshah:1234@cluster0.lx1ltgv.mongodb.net/AppointementsDB?retryWrites=true&w=majority";
mongoose.connect(mongoDBConnectionString, {
  useNewUrlParser: true,
});

app.use("/", userRoutes);
app.use("/", appointment);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
