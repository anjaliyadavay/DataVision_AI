import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  // ✅ ADD THIS LINE
  role: { type: String, enum: ["user", "admin"], default: "user" },

  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
