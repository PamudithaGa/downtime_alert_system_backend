// controllers/machineController.js
import MachineData from "../models/MachineData.js";

export const getMachines = async (req, res) => {
  try {
    const machines = await MachineData.find();
    res.json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params; // Machine document _id
    const { status } = req.body;

    if (!["down", "arrived", "running"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateFields = { status };

    // If status is "arrived", set m_ArrivalTime
    if (status === "arrived") {
      updateFields.m_ArrivalTime = new Date();
    }

    // If status is "running", set breakdownEndTime
    if (status === "running") {
      updateFields.breakdownEndTime = new Date();
    }

    const updatedMachine = await MachineData.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.json(updatedMachine);
  } catch (error) {
    console.error("Error updating machine status:", error);
    res.status(500).json({ message: "Server error" });
  }
};



