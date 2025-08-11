import mongoose from "mongoose";

const machineDataSchema = new mongoose.Schema({
  machineId: { type: String, required: true },   // custom ID like "M001"
  machineName: { type: String, required: true },
  machineOwner: { type: String },
  machineType: { type: String, required: true },
  section: { type: String },
  line: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ["down", "arrived", "running"],
  },
});

const MachineData = mongoose.model("MachineData", machineDataSchema);
export default MachineData;
