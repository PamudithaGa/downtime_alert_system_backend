// // index.js
// import express from "express";
// import cors from "cors";
// import mqtt from "mqtt";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import { saveDataToMongo } from "./services/dataService.js";
// import { sendAlertNotification } from "./services/notificationService.js";
// import authRoutes from "./routes/auth.js";
// import logRoutes from "./routes/logs.js";
// import machineRoutes from "./routes/machineRoutes.js";
// import { initFirebaseListener } from "./services/firebaseService.js";

// dotenv.config();
// console.log("Loaded Firebase DB URL:", process.env.FIREBASE_DB_URL);
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/logs", logRoutes); 
// app.use("/api/machines", machineRoutes);

// initFirebaseListener();

// app.get("/", (req, res) => {
//   res.send("IoT Backend is Running ✅");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));





//index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import logRoutes from "./routes/logs.js";
import machineRoutes from "./routes/machineRoutes.js";
import { initFirebaseListener } from "./services/firebaseService.js";

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/machines", machineRoutes);

// Firebase listener
initFirebaseListener();

// Health check
app.get("/", (req, res) => {
  res.status(200).send("IoT Backend is Running ✅");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use(cors({
  origin: 'http://localhost:5173'
}));