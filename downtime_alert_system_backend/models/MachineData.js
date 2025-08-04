import mongoose from "mongoose";

const machineDataSchema = new mongoose.Schema({
  machineId: String,
  status: String,
  temperature: Number,
  vibration: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("MachineData", machineDataSchema);
