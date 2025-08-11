import mongoose from "mongoose";

const machineLogsDataSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MachineData",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["down", "arrived", "running"],
  },
  breakdownStartTime: { type: Date },
  m_ArrivalTime: { type: Date },
  breakdownEndTime: { type: Date },
  errorDescription: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const MachineLogs = mongoose.model("MachineLogsData", machineLogsDataSchema);
export default MachineLogs;
