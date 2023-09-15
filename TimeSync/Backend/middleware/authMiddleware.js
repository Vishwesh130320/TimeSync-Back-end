// const jwt = require("jsonwebtoken");
// const secretKey =
// "7f4e1dfc3228a6b24baa7ce744ecc3d9719f75990a704b8927ef136372c0566aa5aaabdb8b63b8de626f20574120564971b182d19a88ac3e502df10adead61d3";
// const User = require("../models/userSchema");

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("x-auth-token");

//   // Check if there's no token
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, secretKey);

//     // Find the user by the decoded user ID
//     const user = await User.findById(decoded.userId);

//     // If the user doesn't exist
//     if (!user) {
//       return res.status(401).json({ msg: "Token is not valid" });
//     }

//     // Populate req.user with user data for future middleware/routes
//     req.user = user;
//     next(); // Move on to the next middleware/route
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const secretKey =
  "7f4e1dfc3228a6b24baa7ce744ecc3d9719f75990a704b8927ef136372c0566aa5aaabdb8b63b8de626f20574120564971b182d19a88ac3e502df10adead61d3";
const User = require("/Users/vishweshshah/Documents/Git/TimeSync/TimeSync/Backend/models/userSchema.js");

const authMiddleware = async (req, res, next) => {
  const excludedRoutes = ["/register", "/login"];
  if (excludedRoutes.includes(req.path)) {
    return next();
  }

  const token = req.header("x-auth-token");

  // Check if there's no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by the decoded user ID
    const user = await User.findById(decoded.userId);

    // If the user doesn't exist
    if (!user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    req.user = user;
    next(); // Move on to the next middleware/route
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ msg: "Server Error", err });
  }
};

module.exports = authMiddleware;
