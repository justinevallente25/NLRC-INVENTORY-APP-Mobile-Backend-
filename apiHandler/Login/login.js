import express from "express";
import { mainDB } from "../../database/index.js";
import { func_Decrypt } from "../../utils/encryptPassword.js";
import { updateSession } from "../../utils/sessionStore.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!username || !password) {
    console.log(`${ip} | UNKNOWN (login-failure)`);
    return res.status(400).json({ error: "Username and password required" });
  }

  mainDB.query(
    "SELECT * FROM m_useraccounts WHERE UAUsername = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = results[0];
      if (password !== func_Decrypt(user.UAPassword))
        return res.status(401).json({ error: "Invalid credentials" });

      const token = updateSession(username);

      console.log(`${ip} | ${username} (login-success)`);

      res.json({
        message: "Login successful",
        token,
        user: {
          UAUsername: user.UAUsername,
          UAModule: user.UAModule,
          EMID: user.EMID,
        },
      });
    }
  );
});

export default router;
