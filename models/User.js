//
import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  lines: [lineSchema], 
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    required: true,
    enum: ["technical", "quality", "industrialeng", "cutting", "subassembly", "production"],
  },
  createdAt: { type: Date, default: Date.now },
  epf: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  production: {
    type: {
      sections: [sectionSchema], 
    },
    required: function () { return this.department === "production"; },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
