import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lines: [lineSchema],
});

const departmentRoles = {
  production: [
    "Team Leader",
    "Group Leader",
    "Value stream executive",
    "Value stream manager",
  ],
  technical: ["Staff member", "Executive"],
  engineering: ["mechanic", "Executive"],
  quality: ["Staff member", "Executive"],
  cutting: ["Staff member", "Executive"],
  industrialeng: ["Staff member", "Executive"],
  subassembly: [
    "Team Leader",
    "Group Leader",
    "Value stream executive",
    "Head of Department",
  ],
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  epf: { type: String, required: true, unique: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+94\d{9}$/, "Phone number must be in format +94XXXXXXXXX"],
  },
  department: {
    type: String,
    required: true,
    enum: Object.keys(departmentRoles),
  },
  role: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return departmentRoles[this.department]?.includes(value);
      },
      message: (props) => `${props.value} is not a valid role for department `,
    },
  },
  production: {
    type: {
      sections: [sectionSchema],
    },
    required: function () {
      return this.department === "production";
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
