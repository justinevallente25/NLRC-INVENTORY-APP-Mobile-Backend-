// apiHandler/Login/logout.js
import express from "express";
import { removeSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { username } = req.body || {};

  const logAttempt = (status, duration) => {
    if (req.log) {
      req.log(
        `${username || "UNKNOWN"} (${status})${
          duration ? ` | Active: ${duration} seconds` : ""
        }`
      );
    } else {
      console.log(
        `${ip} | ${username || "UNKNOWN"} (${status})${
          duration ? ` | Active: ${duration} seconds` : ""
        }`
      );
    }
  };

  try {
    let activeSeconds = null;

    if (username) {
      const session = removeSession(username);
      if (session && session.loginTime) {
        activeSeconds = Math.floor(
          (new Date() - new Date(session.loginTime)) / 1000
        );
      }
    }

    logAttempt("logout-success", activeSeconds);

    res.json({ message: "Logout successful", activeSeconds });
  } catch (err) {
    logAttempt("logout-failure");
    console.error("❌ Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
