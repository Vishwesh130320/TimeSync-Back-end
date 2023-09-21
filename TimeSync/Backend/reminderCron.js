const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Appointment = require("./appointment");

mongoose.connect(
  "mongodb+srv://vishweshshah:1234@cluster0.lx1ltgv.mongodb.net/AppointementsDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "vishweshshah999@gmail.com",
    pass: "jyuxkjdbapqrxncj",
  },
});

const changestatus = async () => {
  try {
    const currentTime = new Date();
    const appointment = await Appointment.updateMany(
      {
        appointmentDate: {
          $lt: currentTime,
        },
      },
      { $set: { status: "Completed" } }
    );
    console.log("Reminder cron job executed successfully");
  } catch (error) {
    console.error("Error executing reminder cron job:", error);
  }
};

const sendNoti = async () => {
  try {
    const currentTime = new Date();
    const next30Minutes = new Date(currentTime.getTime() + 1 * 60 * 1000);
    const next60Minutes = new Date(currentTime.getTime() + 10 * 60 * 1000);
    console.log(next30Minutes, next60Minutes);
    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: next30Minutes,
        $lte: next60Minutes,
      },
    });

    console.log("No of appointments", appointments);

    for (const appointment of appointments) {
      const mailOptions = {
        from: "vishweshshah999@gmail.com",
        to: appointment.clientEmail,
        subject: "Appointment Reminder",
        text: `Hi ${appointment.clientFirstName}, this is a reminder for your appointment on ${appointment.appointmentDate}`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent to ${appointment.clientEmail}`);
    }

    console.log("Reminder cron job executed successfully");
  } catch (error) {
    console.error("Error executing reminder cron job:", error);
  }
};
cron.schedule("*/1 * * * *", async () => {
  await changestatus();
  await sendNoti();
});
