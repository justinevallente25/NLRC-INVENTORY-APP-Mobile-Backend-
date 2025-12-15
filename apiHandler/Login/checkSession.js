// apiHandler/Login/checkSession.js
import express from "express";
import { checkSession } from "../../utils/sessionStore.js";

const router = express.Router();

// POST /api/check-session
router.post("/", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  if (!checkSession(username)) {
    return res.status(401).json({ error: "Session expired" });
  }

  res.json({ message: "Session active" });
});

export default router;
