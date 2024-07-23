const express = require("express");
const masterRoute = express.Router();
const usersRoute = require("./usersRoute");
const authRoute = require("./authRoute");
masterRoute.use("/users", usersRoute);
masterRoute.use("/auth", authRoute);

module.exports = masterRoute;
