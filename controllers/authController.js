import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

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

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      epf,
      role,
      section,
      line,
      phone,
    } = req.body;

    // Basic field validation
    if (
      !name ||
      !email ||
      !password ||
      !epf ||
      !department ||
      !role ||
      !phone
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate department
    if (!departmentRoles[department]) {
      return res
        .status(400)
        .json({ message: `Invalid department: ${department}` });
    }

    // Validate role for department
    if (!departmentRoles[department].includes(role)) {
      return res.status(400).json({
        message: `${role} is not a valid role for department ${department}`,
      });
    }

    // Validate phone format
    const phoneRegex = /^\+94\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number. Use format +94XXXXXXXXX" });
    }

    // ✅ Duplicate phone check
    const existingUserPhone = await User.findOne({ phone });
    if (existingUserPhone) {
      return res
        .status(409)
        .json({ message: "Phone number already registered." });
    }

    // Check if user already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const existingUserEpf = await User.findOne({ epf });
    if (existingUserEpf) {
      return res.status(409).json({ message: "EPF already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare production structure if needed
    let productionData;
    if (department === "production") {
      productionData = {
        sections: Array.from({ length: 6 }, (_, i) => ({
          name: `Section${i + 1}`,
          lines: Array.from({ length: 9 }, (_, j) => ({
            name: `Line${j + 1}`,
            teamLeaders: [],
          })),
        })),
      };

      // If team leader in production → must have section + line
      if (role === "Team Leader" && (!section || !line)) {
        return res.status(400).json({
          message: "Team Leader in production must select a Section and Line.",
        });
      }
    }

    let engineeringData;
    if (department === "engineering") {
      productionData = {
        sections: Array.from({ length: 6 }, (_, i) => ({
          name: `Section${i + 1}`,
          lines: Array.from({ length: 9 }, (_, j) => ({
            name: `Line${j + 1}`,
            teamLeaders: [],
          })),
        })),
      };

      // If team leader in production → must have section + line
      if (role === "Team Leader" && (!section || !line)) {
        return res.status(400).json({
          message: "Team Leader in production must select a Section and Line.",
        });
      }
    }
    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      epf,
      role,
      section,
      line,
      phone,
      production: productionData,
      engineering: engineeringData,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login function
export const loginUser = async (req, res) => {
  try {
    const { epf, password } = req.body;

    // Check required fields
    if (!epf || !password) {
      return res
        .status(400)
        .json({ message: "EPF and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ epf });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        epf: user.epf,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send token and user info (without password)
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        epf: user.epf,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Logout Function
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
