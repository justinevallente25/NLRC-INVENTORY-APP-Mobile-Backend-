//apiHandler/Login/login.js
import express from "express";
import { mainDB } from "../../database/index.js";
import { func_Decrypt } from "../../utils/encryptPassword.js";
import { updateSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const logAttempt = (status) => {
    console.log(`${ip} | ${username || "UNKNOWN"} (${status})`);
  };

  if (!username || !password) {
    logAttempt("failure");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  mainDB.query(
    "SELECT * FROM m_useraccounts WHERE UAUsername = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database query error" });
      if (results.length === 0) {
        logAttempt("failure");
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user = results[0];
      if (password !== func_Decrypt(user.UAPassword)) {
        logAttempt("failure");
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Mark user active
      mainDB.query(
        "UPDATE m_useraccounts SET UAActive = 1 WHERE UAUsername = ?",
        [username]
      );

      // Create encrypted session token
      const token = updateSession(username);

      logAttempt("login-success");
      res.json({
        message: "Login successful",
        token,
        user: {
          pointer: user.pointer,
          UAUsername: user.UAUsername,
          UAModule: user.UAModule,
          EMID: user.EMID,
        },
      });
    }
  );
});

export default router;
