const express = require("express");
const users = require("./MOCK_DATA.json");
const imagesInfo = require("./image_data.json");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const fs = require("fs");
const cors = require("cors");
const masterRoute = require("./routes/index");

// db connection
require("./config/db/connection")();

app.use(cors());
/* ---------------- middleware - plugin------------------- */
app.use(express.urlencoded({ extended: false }));

//to parse request body
app.use(express.json());

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${new Date().toLocaleString()}: ${req.ip} ${req.method} ${req.path}`,
    (err, data) => {
      next();
    }
  );
});

//All routes
app.use("/", masterRoute);

app.get("/get_image_info", (req, res) => {
  // Example image path and description
  const imagesInfo1 = imagesInfo;
  res.json(imagesInfo1);
});

app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});
