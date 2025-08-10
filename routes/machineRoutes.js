import express from "express";
import {getMachines, updateMachineStatus } from "../controllers/machineController.js";

const router = express.Router();

router.get("/machines", getMachines);
router.put("/machines/:id/status", updateMachineStatus);

export default router;
