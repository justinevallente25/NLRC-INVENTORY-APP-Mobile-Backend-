//apiHandler/Login/activity.js
import express from "express";
import { touchSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token required" });

  const ok = touchSession(token);
  if (!ok) return res.status(401).json({ error: "Session expired" });

  res.json({ status: "ACTIVE" });
});

export default router;
