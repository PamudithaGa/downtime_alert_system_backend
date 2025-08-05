import mongoose from "mongoose";

const machineDataSchema = new mongoose.Schema({
  machineId: String,
  machineName: String, // ✅ added
  machineType: String, // ✅ added
  status: String,
  temperature: Number,
  vibration: Number,
  breakdownStartTime: Date, // ✅ added
  breakdownEndTime: Date, // ✅ added
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("MachineData", machineDataSchema);
