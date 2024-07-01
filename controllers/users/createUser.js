const logger = require("../../utils/logger");
const User = require("../../models/user");
const createUser = async (req, res) => {
  const user = req.body;
  console.log(req.body);
  if (!user.first_name || !user.last_name || !user.email) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await User.create({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      job_title: user.job_title,
      gender: user.gender,
    });
    logger.info("result", result);
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    logger.error("Error in creating user:", error);
    return res.status(500).send("Server Error");
  }
};

module.exports = createUser;
