// apihandler/scan/saveSerialNum.js
import express from "express";
import { mainDB } from "../../database/index.js";

const router = express.Router();

/**
 * POST /api/scan/saveSerialNum
 * Body: { pointer, serial_number, updated_by }
 */
router.post("/", (req, res) => {
  const { pointer, serial_number, updated_by } = req.body;

  if (!pointer || !serial_number) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // 1️⃣ Check if the serial_number already exists
  const checkQuery = "SELECT pointer FROM inv_devices WHERE serial_number = ?";
  mainDB.query(checkQuery, [serial_number], (err, results) => {
    if (err) {
      console.error("DB Error (check duplicate):", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This serial number already exists",
      });
    }

    // 2️⃣ Save the serial number
    const updateQuery =
      "UPDATE inv_devices SET serial_number = ?, updated_by = ? WHERE pointer = ?";
    mainDB.query(updateQuery, [serial_number, updated_by, pointer], (err2) => {
      if (err2) {
        console.error("DB Error (save serial):", err2);
        return res
          .status(500)
          .json({ success: false, message: "Failed to save serial number" });
      }

      return res.json({
        success: true,
        message: "Serial number saved successfully",
      });
    });
  });
});

export default router;
