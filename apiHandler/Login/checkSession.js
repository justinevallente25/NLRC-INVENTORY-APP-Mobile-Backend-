//apiHandler/Login/checkSession.js
import express from "express";
import { checkSession } from "../../utils/sessionStore.js";

const router = express.Router();

// POST /api/check-session
router.post("/", (req, res) => {
  const { token } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!token) {
    console.log(`${ip} | UNKNOWN (check-session-failure: missing token)`);
    return res.status(400).json({ error: "Session token required" });
  }

  const username = checkSession(token);

  if (!username) {
    console.log(
      `${ip} | UNKNOWN (check-session-failure: expired/invalid token)`
    );
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  console.log(`${ip} | ${username} (check-session-success)`);
  res.json({ message: "Session active", username });
});

export default router;
