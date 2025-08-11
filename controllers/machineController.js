// controllers/machineController.js
import MachineData from "../models/MachineData.js";

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
    res.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Server error" });
  }
};





