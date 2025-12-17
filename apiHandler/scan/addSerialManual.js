//apiHandler/scan/addSerialManual.js
import express from "express";
import { mainDB } from "../../database/index.js";

const router = express.Router();

/**
 * POST /api/scan/addSerialManual
 * Body: { devicePointer, serial_number, confirm }
 */
router.post("/", (req, res) => {
  const { devicePointer, serial_number, confirm } = req.body;

  if (!devicePointer || !serial_number) {
    return res.status(400).json({
      success: false,
      message: "Device pointer and serial number are required",
    });
  }

  // Require confirmation
  if (!confirm) {
    return res.status(400).json({
      success: false,
      message: "Please confirm adding the serial number",
    });
  }

  // 1️⃣ Check if serial already exists
  const checkSerialQuery = `
    SELECT pointer 
    FROM inv_devices 
    WHERE serial_number = ?
    LIMIT 1
  `;

  mainDB.query(checkSerialQuery, [serial_number], (err, existing) => {
    if (err) {
      console.error("❌ Serial check error:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Serial number already exists",
      });
    }

    // 2️⃣ Update device
    const updateQuery = `
      UPDATE inv_devices
      SET serial_number = ?, updated_at = NOW()
      WHERE pointer = ?
    `;

    mainDB.query(updateQuery, [serial_number, devicePointer], (err, result) => {
      if (err) {
        console.error("❌ Update error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to update serial number",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Device not found",
        });
      }

      res.json({
        success: true,
        message: "Serial number added successfully",
      });
    });
  });
});

export default router;
