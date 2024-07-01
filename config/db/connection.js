const mongoose = require("mongoose");
const logger = require("../../utils/logger");

// bittu1040
// cnSDoVH5TlTSnPap

const uri = `mongodb+srv://bittu1040:cnSDoVH5TlTSnPap@test-node.ex0ov2a.mongodb.net/?retryWrites=true&w=majority&appName=test-node`;

const connection = async () => {
  try {
    const conn = await mongoose.connect(uri);
    if (conn) logger.info("Data has been fetched");
  } catch (err) {
    logger.error("Database connection error", err.message);
  }
};

module.exports = connection;
