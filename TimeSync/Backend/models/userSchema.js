const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "{VALUE} is not a valid email",
    },
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["doctor", "patient"],
    required: true,
  },
  birthdate: { type: Date },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
});

const Users = mongoose.model("User", userSchema);
module.exports = Users;
