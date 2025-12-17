//apiHandler/scan/deviceDetails.js
import express from "express";
import { mainDB } from "../../database/index.js";

const router = express.Router();

/**
 * GET /api/scan/device/:pointer
 * Fetch FULL device details (Formatted specs)
 */
router.get("/:pointer", (req, res) => {
  const { pointer } = req.params;

  const query = `
    SELECT
      d.pointer,
      d.property_number,
      d.serial_number,
      d.nsoc_name,
      d.model,
      d.status,
      d.ass_status,
      d.purchase_date,
      d.warranty_expires,
      d.cost,
      d.notes,
      d.created_at,
      d.updated_at,

      -- joins
      b.brand_name AS brand,
      c.category_name AS category,
      REPLACE(s.specs, ';', ';\n') AS specs

    FROM inv_devices d
    LEFT JOIN inv_brands b
      ON d.brands = b.pointer
    LEFT JOIN inv_device_category c
      ON d.dev_category_pointer = c.pointer
    LEFT JOIN inv_specs s
      ON s.category_id = c.pointer
    WHERE d.pointer = ?
    LIMIT 1
  `;

  mainDB.query(query, [pointer], (err, results) => {
    if (err) {
      console.error("❌ Device details error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.json({
      success: true,
      data: results[0],
    });
  });
});

export default router;
