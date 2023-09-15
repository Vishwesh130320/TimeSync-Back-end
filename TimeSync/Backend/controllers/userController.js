const User = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  // Register a new user
  registerUser: async (req, res) => {
    try {
      const { username, password, role, email } = req.body;
      // Check if the username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      // Hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Creating a new user
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
        email,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  // Login a user
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });

      // Checking if the user exists
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generated a JWT token for authentication
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        "7f4e1dfc3228a6b24baa7ce744ecc3d9719f75990a704b8927ef136372c0566aa5aaabdb8b63b8de626f20574120564971b182d19a88ac3e502df10adead61d3"
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to log in" });
    }
  },
};

module.exports = userController;
