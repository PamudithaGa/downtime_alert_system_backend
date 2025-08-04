// services/mongoService.js
import mongoose from "mongoose";

const downtimeSchema = new mongoose.Schema({
  machineId: String,
  status: String,
  timestamp: { type: Date, default: Date.now },
  faultType: String,
  suggestion: String,
});

const DowntimeLog = mongoose.model("DowntimeLog", downtimeSchema);

export const saveDataToMongo = async (data) => {
  try {
    const log = new DowntimeLog(data);
    await log.save();
    console.log("Data saved to MongoDB");
  } catch (err) {
    console.error("MongoDB save error:", err);
  }
};
