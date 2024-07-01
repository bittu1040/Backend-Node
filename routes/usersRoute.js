const express = require("express");
const usersRoute = express.Router();
const getAllUsers = require("../controllers/users/getAllUsers");
const createUser = require("../controllers/users/createUser");

usersRoute.get("/getAllUser", getAllUsers);
usersRoute.post("/createUser", createUser);

module.exports = usersRoute;
