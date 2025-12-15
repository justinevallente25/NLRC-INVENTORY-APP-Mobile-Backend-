//apiHandler/Login/logout.js
import express from "express";
import { removeSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Helper to log logout attempts
  const logAttempt = (status, duration, username) => {
    console.log(
      `${ip} | ${username || "UNKNOWN"} (${status})${
        duration ? ` | Active: ${duration} seconds` : ""
      }`
    );
  };

  // If token is missing, immediately log failure
  if (!token) {
    logAttempt("logout-failure", null, "UNKNOWN");
    return res.status(400).json({ error: "Session token required" });
  }

  try {
    const session = removeSession(token);

    if (!session) {
      // Token invalid or expired
      logAttempt("logout-failure", null, "UNKNOWN");
      return res
        .status(401)
        .json({ error: "Invalid or expired session token" });
    }

    const username = session.username;
    let activeSeconds = null;

    if (session.loginTime) {
      activeSeconds = Math.floor(
        (new Date() - new Date(session.loginTime)) / 1000
      );
    }

    logAttempt("logout-success", activeSeconds, username);
    res.json({ message: "Logout successful", activeSeconds });
  } catch (err) {
    logAttempt("logout-failure", null, "UNKNOWN");
    console.error("❌ Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
