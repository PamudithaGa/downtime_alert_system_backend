// services/smsService.js
import twilio from "twilio";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSmsToTechnicians(machine) {
  try {
    const technicians = await User.find({
      department: "engineering",
      section: machine.section,
      line: machine.line,
      role: "mechanic",
    });

    for (const tech of technicians) {
      if (tech.phone) {
        await client.messages.create({
          body: `🚨 ALERT: Machine ${machine.machineName} (${machine.machineId}) is DOWN in Section ${machine.section}, Line ${machine.line}. Please check immediately.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: tech.phone,
        });
      }
    }
  } catch (err) {
    console.error("SMS sending failed:", err);
  }
}
