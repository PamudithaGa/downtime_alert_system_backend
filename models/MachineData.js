import mongoose from "mongoose";

const machineDataSchema = new mongoose.Schema({
  machineId: { type: String, required: true },
  machineName: { type: String, required: true },
  machineType:{ type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["down" ,"arrived" ,"running"], 
  },
  breakdownStartTime:{type: Date, required: true},
  m_ArrivalTime: {type: Date, required: false},
  breakdownEndTime:  {type: Date, required: false},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MachineData = mongoose.model("MachineData", machineDataSchema);
export default MachineData;