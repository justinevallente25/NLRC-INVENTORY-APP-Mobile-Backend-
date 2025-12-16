//apiHandler/Login/logout.js
import express from "express";
import { removeSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.body;
  const ip = req.socket.remoteAddress;

  if (!token) return res.status(400).json({ error: "Session token required" });

  const session = removeSession(token);
  if (!session)
    return res.status(401).json({ error: "Invalid or expired session" });

  const activeSeconds = Math.floor((Date.now() - session.loginTime) / 1000);

  console.log(
    `${ip} | ${session.username} (logout-success) | Active: ${activeSeconds}s`
  );

  res.json({ message: "Logout successful", activeSeconds });
});

export default router;
