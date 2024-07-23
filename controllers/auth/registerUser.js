const User = require("../../models/user");

// Function to validate fields
const validateField = (field, value, password) => {
  switch (field) {
    case "firstName":
      if (!value || value.trim() === "") {
        return "First name is required";
      }
      break;
    case "lastName":
      if (!value || value.trim() === "") {
        return "Last name is required";
      }
      break;
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        return "Email is required.";
      }
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      break;
    case "password":
      if (
        !value ||
        value.length < 8 ||
        !/[A-Z]/.test(value) ||
        !/[a-z]/.test(value) ||
        !/[0-9]/.test(value) ||
        !/[!@#$%^&*]/.test(value)
      ) {
        return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character";
      }
      break;
    case "cpassword":
      if (!value) {
        return "Confirm password is required";
      }
      if (value !== password) {
        return "Passwords do not match";
      }
      break;
    default:
      return null;
  }
};

// API endpoint to handle user registration
const registeUser = async (req, res) => {
  const { firstName, lastName, email, password, cpassword } = req.body;

  const errors = [];

  // Validate each field
  ["firstName", "lastName", "email", "password", "cpassword"].forEach(
    (field) => {
      const error = validateField(field, req.body[field], password);
      if (error) {
        errors.push(error);
      }
    }
  );

  if (errors.length > 0) {
    return res.status(400).json({
      status: "Failed",
      error: errors,
    });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        error: "User with this email or username already exists",
      });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      cpassword,
    });

    await newUser.save();
    res.status(201).json({
      staus: "Success",
      message: "User saved successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ staus: "Failed", error: err.message });
  }
};

module.exports = registeUser;
