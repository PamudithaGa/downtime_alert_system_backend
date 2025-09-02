// controllers/machineController.js
import MachineData from "../models/MachineData.js";
import MachineLogs from "../models/MachineLogs.js";

export const addMachines = async (req, res) => {
  try {
    const {
      machineId,
      machineName,
      machineOwner,
      machineType,
      section,
      line,
      status,
    } = req.body;

    if (!machineId || !machineName || !machineType || !status) {
      return res.status(400).json({
        error: "machineId, machineName, machineType, and status are required",
      });
    }

    const newMachine = new MachineData({
      machineId,
      machineName,
      machineOwner,
      machineType,
      section,
      line,
      status,
    });

    // Save to DB
    const savedMachine = await newMachine.save();

    res.status(201).json(savedMachine);
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Server error while adding machine" });
  }
};


export const getMachines = async (req, res) => {
  try {
    const machines = await MachineData.find();

    const machinesWithLogs = await Promise.all(
      machines.map(async (machine) => {
        const logs = await MachineLogs.find({
          machine: machine._id,
        }).sort({ timestamp: -1 });

        return {
          ...machine.toObject(),
          logs,
        };
      })
    );

    res.json(machinesWithLogs);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getDownMachines = async (req, res) => {
  try {
const downMachines = await MachineData.find({
  status: { $in: ["down", "arrived"] }
});

    const machinesWithLogs = await Promise.all(
      downMachines.map(async (machine) => {
        const logs = await MachineLogs.find({ machine: machine._id })
          .sort({ timestamp: -1 })

        return {
          ...machine.toObject(),
          logs,
        };
      })
    );

    res.status(200).json(machinesWithLogs);
  } catch (error) {
    console.error("Error fetching down machines:", error);
    res.status(500).json({ message: "Server error" });
  }
};