const express = require("express");
const router = express.Router();
const { verifySupabaseToken } = require("../middleware/supabaseAuthMiddleware");

router.get("/profile", verifySupabaseToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
