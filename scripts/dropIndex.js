import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo connected");

    await mongoose.connection.db
      .collection("machinelogsdatas")
      .dropIndex("firebaseId_1");

    console.log("✅ Dropped unique index on firebaseId");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error dropping index:", err.message);
    process.exit(1);
  }
};

dropIndex();
