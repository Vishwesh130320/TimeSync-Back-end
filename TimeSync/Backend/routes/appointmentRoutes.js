const express = require("express");
const router = express.Router();
const appointmentController = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/controllers/appointmentController.js");
const authMiddleware = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/middleware/authMiddleware.js");

router.post(
  "/appointment/create",
  authMiddleware,
  appointmentController.createAppointment
);
router.get(
  "/appointment/get",
  authMiddleware,
  appointmentController.getAllAppointments
);
router.put(
  "/appointment/update/:id",
  authMiddleware,
  appointmentController.updateAppointment
);
router.get(
  "/appointment/freetimeslots/:date",
  authMiddleware,
  appointmentController.freeTimeSlots
);
module.exports = router;
