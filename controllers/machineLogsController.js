import MachineData from "../models/MachineData.js";
import MachineLogs from "../models/MachineLogs.js";

export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params; // MachineData _id
    const { status, errorDescription } = req.body;

    if (!["down", "arrived", "running"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Get the static machine info
    const machine = await MachineData.findById(id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Determine times
    let breakdownStartTime;
    let m_ArrivalTime;
    let breakdownEndTime;

    if (status === "down") {
      breakdownStartTime = new Date();
    } else if (status === "arrived") {
      m_ArrivalTime = new Date();
    } else if (status === "running") {
      breakdownEndTime = new Date();
    }

    // Create a log entry
    // const logEntry = await MachineLogsData.create({
    //   machineId: machine.machineId, // Use machine's unique ID
    //   m_Id: id, // MongoDB ObjectId of the machine
    //   status,
    //   breakdownStartTime,
    //   m_ArrivalTime,
    //   breakdownEndTime,
    //   errorDescription: errorDescription || "",
    // });

    const logEntry = await MachineLogs.create({
      machine: id, // ObjectId reference
      status,
      breakdownStartTime,
      m_ArrivalTime,
      breakdownEndTime,
      errorDescription: errorDescription || "",
    });

    machine.status = status;
    await machine.save();

    res.status(201).json({
      message: "Status updated successfully",
      log: logEntry,
      updatedMachine: machine,
    });
  } catch (error) {
    console.error("Error updating machine status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
