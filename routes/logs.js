// routes/logs.js
import express from "express";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "🔐 Protected logs accessed",
    user: req.user, // From JWT
  });
});

export default router;
