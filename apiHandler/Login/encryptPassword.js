//apiHandler/Login/encryptPassword.js
const express = require("express");
const router = express.Router();
const {
  func_Encrypt,
  func_Decrypt,
} = require("../../../utils/encryptPassword");

// POST /api/login/encrypt
router.post("/encrypt", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password is required" });

  const encrypted = func_Encrypt(password);
  res.json({ encrypted });
});

// POST /api/login/decrypt
router.post("/decrypt", (req, res) => {
  const { encryptedText } = req.body;
  if (!encryptedText)
    return res.status(400).json({ error: "Encrypted text is required" });

  const decrypted = func_Decrypt(encryptedText);
  res.json({ decrypted });
});

module.exports = router;
