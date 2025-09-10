//controllers/machineLogsController
import MachineData from "../models/MachineData.js";
import MachineLogs from "../models/MachineLogs.js";
import { sendSmsToTechnicians } from "../services/smsService.js";

export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
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
    let time;
    let m_ArrivalTime;
    let breakdownEndTime;

    if (status === "down") {
      time = new Date();
      // 🚨 send SMS to mechanics here
      await sendSmsToTechnicians(machine);
    } else if (status === "arrived") {
      m_ArrivalTime = new Date();
    } else if (status === "running") {
      breakdownEndTime = new Date();
    }

    const logEntry = await MachineLogs.create({
      machine: id,
      status,
      time,
      m_ArrivalTime,
      breakdownEndTime,
      errorDescription: errorDescription || "",
      mechenicId: req.user.id,
      timestamp: new Date(),
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
