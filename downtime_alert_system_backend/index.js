import express from "express";
import cors from "cors";
import mqtt from "mqtt";
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import { saveDataToFirestore } from "./services/firestoreService.js";
import { sendAlertNotification } from "./services/notificationService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Fix: Read and sanitize Firebase config
const serviceAccountRaw = fs.readFileSync("./firebase-config.json", "utf8");
const serviceAccount = JSON.parse(serviceAccountRaw);

// ✅ Replace escaped newlines in private key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// ✅ Prevent duplicate Firebase app initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// ✅ MQTT setup
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL); // e.g. mqtt://localhost

mqttClient.on("connect", () => {
  console.log("✅ Connected to MQTT Broker");
  mqttClient.subscribe("machine/+/status");
});

mqttClient.on("message", async (topic, message) => {
  const payload = JSON.parse(message.toString());
  console.log(`📩 MQTT Message on ${topic}:`, payload);

  try {
    // Save to Firebase
    await saveDataToFirestore(db, payload);
    console.log("✅ Data saved to Firestore:", payload); // <--- SUCCESS LOG

    // Send alert if needed
    if (payload.status === "error") {
      await sendAlertNotification(payload);
    }
  } catch (error) {
    console.error("❌ Error saving to Firestore:", error.message);
  }
});

// ✅ Sample route
app.get("/", (req, res) => {
  res.send("IoT Backend is Running ✅");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
