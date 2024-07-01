const User = require("../../models/user");
const logger = require("../../utils/logger");

const getAllUsers = async (req, res) => {
  try {
    const allDBUsers = await User.find({});
    return res
      .status(201)
      .json({ message: "data has been fetched", data: allDBUsers });
  } catch (err) {
    logger.err("Error in fetching users!!", err);
    return res.status(500).send("Server Error");
  }
};

module.exports = getAllUsers;
