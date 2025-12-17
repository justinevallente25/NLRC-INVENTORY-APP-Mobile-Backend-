//apiHandler/scan/noSerialList.js
import express from "express";
import { mainDB } from "../../database/index.js";

const router = express.Router();

// GET /api/scan/noSerialList?page=1&limit=5
router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Base query for devices without serial numbers
  const baseQuery = `
    FROM inv_devices d
    LEFT JOIN inv_brands b ON d.brands = b.pointer
    LEFT JOIN inv_device_category c ON d.dev_category_pointer = c.pointer
    WHERE d.serial_number IS NULL
       OR d.serial_number = ''
       OR UPPER(d.serial_number) = 'NULL'
  `;

  // Total count query
  const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;

  mainDB.query(countQuery, (err, countResults) => {
    if (err) {
      console.error("❌ Error counting devices:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Database query failed" });
    }

    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    // Actual data query with LIMIT & OFFSET
    const dataQuery = `
      SELECT d.pointer,
             d.property_number,
             d.serial_number,
             CASE
               WHEN d.serial_number IS NULL THEN 'Missing'
               WHEN d.serial_number = '' THEN 'Empty'
               WHEN UPPER(d.serial_number) = 'NULL' THEN 'Invalid'
               ELSE 'Assigned'
             END AS serial_state,
             d.model,
             d.status,
             d.ass_status,
             b.brand_name AS brand,
             c.category_name AS category
      ${baseQuery}
      LIMIT ? OFFSET ?
    `;

    mainDB.query(dataQuery, [limit, offset], (err, results) => {
      if (err) {
        console.error("❌ Error fetching devices:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Database query failed" });
      }

      res.json({
        success: true,
        total,
        totalPages,
        currentPage: page,
        data: results,
      });
    });
  });
});

export default router;
