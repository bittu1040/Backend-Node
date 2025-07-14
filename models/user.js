const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String }, // Optional: You can update from frontend
    email: { type: String, required: true, unique: true },
    supabaseId: { type: String, required: true, unique: true }, // Supabase UUID
    provider: { type: String, default: 'supabase' }, // Optional: for future-proofing
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);