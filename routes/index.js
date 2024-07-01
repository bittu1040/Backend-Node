const express = require("express");
const masterRoute = express.Router();
const usersRoute = require("./usersRoute");
masterRoute.use("/users", usersRoute);

module.exports = masterRoute;
