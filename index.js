const express = require("express");
const users = require("./MOCK_DATA.json");
const imagesInfo = require("./image_data.json");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
const fs = require("fs");
const cors = require("cors");
const masterRoute = require("./routes/index");
const mongoose = require("mongoose");


// db connection
require("./config/db/connection")();

const issueSchema = new mongoose.Schema({
  userName: String,
  issueType: String,
  issue: String,
  issueDescription: String
});

const Issue = mongoose.model('Issue', issueSchema);


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

app.get('/api/getAllissues', async (req, res) => {
  try {
      const issues = await Issue.find();
      res.json(issues);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.post('/api/postIssue', async (req, res) => {
  const issue = new Issue({
      userName: req.body.userName,
      issueType: req.body.issueType,
      issue: req.body.issue,
      issueDescription: req.body.issueDescription
  });

  try {
      const newIssue = await issue.save();
      res.status(201).json(newIssue);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

app.listen(port, function () {
  console.log(`Server is running on port: ${port}`);
});
