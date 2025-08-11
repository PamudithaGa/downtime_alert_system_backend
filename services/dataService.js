import MachineLogs from "../models/MachineLogs.js";

export const saveDataToMongo = async (payload) => {
  try {
    const data = new MachineLogs(payload);
    await data.save();
    console.log("✅ Data saved to MongoDB:", payload);
  } catch (error) {
    console.error("❌ Failed to save data to MongoDB:", error.message);
  }
};
