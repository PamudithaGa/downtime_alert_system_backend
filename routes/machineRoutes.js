import express from "express";
import {
  getMachines,
  addMachines,
  getDownMachines,
} from "../controllers/machineController.js";
import { updateMachineStatus } from "../controllers/machineLogsController.js";
import { authMechanic } from "../middleware/auth.js";
const router = express.Router();

router.post("/add", addMachines);
router.get("/", getMachines);
router.post("/:id/status", updateMachineStatus);
router.get("/down", getDownMachines);
router.put("/:id/status", authMechanic, updateMachineStatus);
export default router;
