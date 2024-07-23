const express = require("express");
const registeUser = require("../controllers/auth/registerUser");
const authRoute = express.Router();

authRoute.post("/registerUser", registeUser);

module.exports = authRoute;
