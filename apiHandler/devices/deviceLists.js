//apiHandler/devices/deviceLists.js
import express from "express";
import { mainDB } from "../../database/index.js";

const router = express.Router();

// GET /api/deviceList?page=1
router.get("/deviceList", (req, res) => {
  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = 10;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT 
      d.property_number,
      d.nsoc_name,
      d.serial_number,
      c.category_name,
      b.brand_name,
      d.model,
      d.status,
      d.ass_status,
      d.warranty_expires
    FROM inv_devices d
    LEFT JOIN inv_device_category c ON d.dev_category_pointer = c.pointer
    LEFT JOIN inv_brands b ON d.brands = b.pointer
    ORDER BY d.pointer DESC
    LIMIT ? OFFSET ?
  `;

  mainDB.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching devices:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Count total devices for pagination info
    mainDB.query(
      "SELECT COUNT(*) AS total FROM inv_devices",
      (err2, countResult) => {
        if (err2) {
          console.error("Error counting devices:", err2);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        const totalDevices = countResult[0].total;
        const totalPages = Math.ceil(totalDevices / limit);

        res.json({
          page,
          totalPages,
          totalDevices,
          devices: results,
        });
      }
    );
  });
});

export default router;
