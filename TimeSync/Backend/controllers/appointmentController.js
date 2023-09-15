const Appointment = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/models/appointment.js");

const appointmentController = {
  // Create a new appointment
  createAppointment: async (req, res) => {
    try {
      const {
        doctorId,
        patientId,
        appointmentDate,
        durationInMinutes,
        status,
        location,
        notes,
      } = req.body;

      // Creating the appointment using the Appointment model
      const appointment = await Appointment.create({
        doctorId: doctorId,
        patientId: patientId,
        appointmentDate,
        durationInMinutes,
        status,
        location,
        notes,
      });

      res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create appointment", error });
    }
  },

  // Getting all Appointments
  getAllAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("doctorId")
        .populate("patientId");
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  },

  // Updating Appointment details
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const { appointmentDate, durationInMinutes, status, location, notes } =
        req.body;

      // Finding the appointment by its ID
      const appointment = await Appointment.findById(id);

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Updating appointment data
      appointment.appointmentDate =
        appointmentDate || appointment.appointmentDate;
      appointment.durationInMinutes =
        durationInMinutes || appointment.durationInMinutes;
      appointment.location = location || appointment.location;
      appointment.notes = notes || appointment.notes;

      if (status === "Canceled") {
        appointment.status = "Canceled";
      }

      // Saving the updated appointment
      await appointment.save();

      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  },

  freeTimeSlots: async (req, res) => {
    try {
      const { date } = req.params;

      // Find all appointments
      const startTime = moment(date)
        .utc()
        .set("hour", "09")
        .set("minute", "00");
      const endTime = moment(date).utc().set("hour", "17").set("minute", "00");
      const appointments = await Appointment.find({
        appointmentDate: {
          $gte: startTime.toDate(),
          $lte: endTime.toDate(),
        },
      }).sort({
        appointmentDate: 1,
      });
      const allTimeSlots = new Set();

      // Calculating the time slots
      let currentTimeSlot = startTime.clone();
      while (currentTimeSlot.isSameOrBefore(endTime)) {
        allTimeSlots.add(currentTimeSlot.toISOString());
        currentTimeSlot.add(30, "minutes");
      }

      const bookedAppointments = new Set();
      for (const appointment of appointments) {
        bookedAppointments.add(
          moment(appointment.appointmentDate).toISOString()
        );
      }

      // Calculating free time slots by filtering out booked slots
      const freeTimeSlots = [...allTimeSlots].filter(
        (slot) => !bookedAppointments.has(slot)
      );

      res.json(freeTimeSlots);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to retrieve free time slots" });
    }
  },
};

module.exports = appointmentController;
