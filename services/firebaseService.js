import admin from "firebase-admin";
import MachineData from "../models/MachineData.js";
import MachineLogs from "../models/MachineLogs.js";
import FirebaseData from "../models/MachineData.js";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();
const firebaseConfig = JSON.parse(
  readFileSync(new URL("../firebase-config.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FIREBASE_DB_URL,
  //  databaseURL: "https://downtimealerts-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();

export const initFirebaseListener = () => {
  const ref = db.ref("machines");

  const getTimestamps = (status) => {
    const now = new Date();
    return {
      breakdownStartTime: status === "down" ? now : null,
      m_ArrivalTime: status === "arrived" ? now : null,
      breakdownEndTime: status === "running" ? now : null,
    };
  };

  // Handle new logs
  ref.on("child_added", async (snapshot) => {
    const data = snapshot.val();
    const firebaseId = snapshot.key;

    try {
      const machine = await MachineData.findOne({
        machineId: data.machineId || firebaseId,
      });
      if (!machine) return console.error(`Machine not found: ${firebaseId}`);

      const { breakdownStartTime, m_ArrivalTime, breakdownEndTime } =
        getTimestamps(data.status || "down");

      const log = await MachineLogs.create({
        firebaseId,
        machine: machine._id,
        status: data.status || "down",
        issue: data.issue || data.errorDescription || "Unknown issue",
        time: data.time || new Date().toISOString(),
        breakdownStartTime,
        m_ArrivalTime,
        breakdownEndTime,
        errorDescription: data.errorDescription || null,
        mechenicId: data.mechenicId || null,
      });

      // Update machine status
      machine.status = data.status || "down";
      await machine.save();

      console.log("✅ New log created & machine status updated:", log._id);
    } catch (err) {
      console.error("❌ Error inserting log:", err.message);
    }
  });

  // Handle updates
  ref.on("child_changed", async (snapshot) => {
    const data = snapshot.val();
    const firebaseId = snapshot.key;

    try {
      const machine = await MachineData.findOne({
        machineId: data.machineId || firebaseId,
      });
      if (!machine) return console.error(`Machine not found: ${firebaseId}`);

      const { breakdownStartTime, m_ArrivalTime, breakdownEndTime } =
        getTimestamps(data.status || "down");

      // Always create a new log, never overwrite
      const log = await MachineLogs.create({
        firebaseId,
        machine: machine._id,
        status: data.status || "down",
        issue: data.issue || data.errorDescription || "Unknown issue",
        time: data.time || new Date().toISOString(),
        breakdownStartTime,
        m_ArrivalTime,
        breakdownEndTime,
        errorDescription: data.errorDescription || null,
        mechenicId: data.mechenicId || null,
      });

      // Update machine status
      machine.status = data.status || "down";
      await machine.save();

      console.log("🔄 New log created for updated data & machine status synced:", log._id);
    } catch (err) {
      console.error("❌ Error creating log on update:", err.message);
    }
  });
};
