const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Email validator
const emailValidator = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//Define a custom password validation function
const passwordValidator = (password) => {
  //Check password length
  if (password.length < 8) {
    return false;
  }

  //Check at least one uppercase
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  //Check at least one lowercase
  if (!/[a-z]/.test(password)) {
    return false;
  }
  //Check at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }
  //Check at least one special charachter
  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  return true;
};
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: emailValidator,
        message: "Please enter a valid email address",
      },
      unique: [true, "user already exist"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: passwordValidator,
        message:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      },
    },
    cpassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//Pre-save hook to hash the password before saving it.
userSchema.pre("save", async function (next) {
  const user = this;
  //only hash the password if it has been modified or is new
  if (!user.isModified("password")) return next();
  //Generate a salt
  try {
    const salt = await bcrypt.genSalt(8);

    //Hash password along with salt
    user.password = await bcrypt.hash(user.password, salt);

    //Clear cpassword field before saving
    user.cpassword = undefined;
    next();
  } catch (err) {
    next(err);
  }
});
const User = mongoose.model("user", userSchema);

module.exports = User;
