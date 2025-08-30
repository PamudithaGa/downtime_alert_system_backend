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
});

const db = admin.database();

export const initFirebaseListener = () => {
  const ref = db.ref("machines");

  ref.on("child_added", async (snapshot) => {
    const data = snapshot.val();
    console.log("New data from Firebase:", data);
    console.log("FIREBASE_DB_URL:", process.env.FIREBASE_DB_URL);

    try {
      await MachineData.create({
        status: data.status || "down",
        machineType: data.machineType || "unknown",
        machineName: data.machineName || "unknown",
        machineId: data.machineId || "unknown",
        issue: data.issue,
        time: data.time,
      });
    } catch (err) {
      console.error("Error inserting MachineData:", err.message);
    }
  });

  ref.on("child_changed", async (snapshot) => {
    const data = snapshot.val();
    console.log("Updated data from Firebase:", data);

    try {
      await MachineLogs.updateOne(
        { firebaseId: snapshot.key },
        { $set: data },
        { upsert: true }
      );
    } catch (err) {
      console.error("Error updating MachineLogs:", err.message);
    }
  });
};
