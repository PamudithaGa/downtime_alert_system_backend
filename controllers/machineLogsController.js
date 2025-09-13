// //controllers/machineLogsController
// import MachineData from "../models/MachineData.js";
// import MachineLogs from "../models/MachineLogs.js";
// import { sendSmsToTechnicians } from "../services/smsService.js";

// export const updateMachineStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, errorDescription } = req.body;

//     if (!["down", "arrived", "running"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     // Get the static machine info
//     const machine = await MachineData.findById(id);
//     if (!machine) {
//       return res.status(404).json({ message: "Machine not found" });
//     }

//     // Determine times
//     let time;
//     let m_ArrivalTime;
//     let breakdownEndTime;

//     if (status === "down") {
//       time = new Date();
//       // 🚨 send SMS to mechanics here
//       await sendSmsToTechnicians(machine);
//     } else if (status === "arrived") {
//       m_ArrivalTime = new Date();
//     } else if (status === "running") {
//       breakdownEndTime = new Date();
//     }

//     const logEntry = await MachineLogs.create({
//       machine: id,
//       status,
//       time,
//       m_ArrivalTime :machine.m_ArrivalTime || new Date().toISOString(),
//       breakdownEndTime : machine.breakdownEndTime|| new Date().toISOString(),
//       errorDescription: errorDescription || "",
//       mechenicId: req.user.id,
//       timestamp: new Date(),
//     });

//     machine.status = status;
//     await machine.save();

//     res.status(201).json({
//       message: "Status updated successfully",
//       log: logEntry,
//       updatedMachine: machine,
//     });
//   } catch (error) {
//     console.error("Error updating machine status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// controllers/machineLogsController.js
import MachineData from "../models/MachineData.js";
import MachineLogs from "../models/MachineLogs.js";
import { sendSmsToTechnicians } from "../services/smsService.js";

const getTimestamps = (status) => {
  const nowStr = new Date().toString(); // Thu Sep 11 2025 00:55:15 GMT+0530 (India Standard Time)
  return {
    time: status === "down" ? nowStr : null,
    m_ArrivalTime: status === "arrived" ? nowStr : null,
    breakdownEndTime: status === "running" ? nowStr : null,
  };
};

export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, errorDescription } = req.body;

    if (!["down", "arrived", "running"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Get machine
    const machine = await MachineData.findById(id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    // Get timestamps as strings
    const { time, m_ArrivalTime, breakdownEndTime } = getTimestamps(status);

    // Create new log
    const logEntry = await MachineLogs.create({
      machine: machine._id,
      status,
      time,
      m_ArrivalTime: m_ArrivalTime || null,
      breakdownEndTime: breakdownEndTime || null,
      errorDescription: errorDescription || null,
      mechenicId: req.user?.id || null,
      firebaseId: req.body.firebaseId || null,
    });

    // Update machine status
    machine.status = status;
    await machine.save();

    // Send SMS if machine is down
    if (status === "down") {
      await sendSmsToTechnicians(machine);
    }

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
