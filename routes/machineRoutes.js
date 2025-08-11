import express from "express";
import { getMachines,addMachines } from "../controllers/machineController.js";
import { updateMachineStatus } from "../controllers/machineLogsController.js";

const router = express.Router();

router.post("/machines/add", addMachines);
router.get("/machines", getMachines);
router.post("/machines/:id/status", updateMachineStatus);

export default router;
