// apiHandler/Login/checkSession.js
import express from "express";
import { checkSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.body;
  const ip = req.socket.remoteAddress;

  if (!token) {
    console.log(`${ip} | UNKNOWN (check-session: missing token)`);
    return res.status(400).json({ valid: false });
  }

  const result = checkSession(token);

  if (!result.valid) {
    console.log(
      `${ip} | ${result.username || "UNKNOWN"} (auto-logout: ${result.reason})`
    );
    return res.status(401).json({
      valid: false,
      reason: result.reason,
      username: result.username || null,
    });
  }

  console.log(`${ip} | ${result.username} (check-session-success)`);
  res.json({
    valid: true,
    username: result.username,
  });
});

export default router;
