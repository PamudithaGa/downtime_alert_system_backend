// index.js
import express from "express";
import cors from "cors";
import mqtt from "mqtt";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { saveDataToMongo } from "./services/dataService.js";
import { sendAlertNotification } from "./services/notificationService.js";
import authRoutes from "./routes/auth.js";
import logRoutes from "./routes/logs.js";
import machineRoutes from "./routes/machineRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes); 
app.use("/api", machineRoutes);

// MQTT Setup
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT Broker");
  mqttClient.subscribe("machine/+/status");
});

mqttClient.on("message", async (topic, message) => {
  const payload = JSON.parse(message.toString());
  console.log(`📩 MQTT Message on ${topic}:`, payload);

  try {
    await saveDataToMongo(payload);
    console.log("✅ Data saved to MongoDB:", payload);

    if (payload.status === "error") {
      await sendAlertNotification(payload);
    }
  } catch (error) {
    console.error("❌ Error saving to MongoDB:", error.message);
  }
});

app.get("/", (req, res) => {
  res.send("IoT Backend is Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
