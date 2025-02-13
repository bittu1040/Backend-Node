const express = require("express");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

module.exports = router;