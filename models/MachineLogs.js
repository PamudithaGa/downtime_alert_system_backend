import mongoose from "mongoose";

const machineLogsDataSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: false,
    unique: false,
  },
  issue: {
    type: String,
    required: false,
  },
  time: {
    type: String, 
    required: false, 
  },
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
  // breakdownStartTime: { type: Date },
  m_ArrivalTime: { type: Date },
  breakdownEndTime: { type: Date },
  errorDescription: { type: String },
  timestamp: { type: Date, default: Date.now },
  mechenicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const MachineLogs = mongoose.model("MachineLogsData", machineLogsDataSchema);
export default MachineLogs;
