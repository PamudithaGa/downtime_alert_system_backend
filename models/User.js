import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    required: true,
    enum: ["technical", "quality", "industrialeng", "cutting", "subassembly"],
  },
  createdAt: { type: Date, default: Date.now },
  epf: { type: String, required: true, unique: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
