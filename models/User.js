// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   department: {
//     type: String,
//     required: true,
//     enum: ["technical", "quality", "industrialeng", "cutting", "subassembly","production"],
//   },
//   createdAt: { type: Date, default: Date.now },
//   epf: { type: String, required: true, unique: true },
//   role: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);
// export default User;



import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Line1, Line2
  teamLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // max 2 per line
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Section1, Section2
  lines: [lineSchema], // 9 lines per section
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
  // Only add this if user belongs to production
  production: {
    type: {
      sections: [sectionSchema], // 6 sections
    },
    required: function () { return this.department === "production"; },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
