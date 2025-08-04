import MachineData from "../models/MachineData.js";

export const saveDataToMongo = async (payload) => {
  try {
    const data = new MachineData(payload);
    await data.save();
    console.log("✅ Data saved to MongoDB:", payload);
  } catch (error) {
    console.error("❌ Failed to save data to MongoDB:", error.message);
  }
};
