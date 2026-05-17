import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query(
    `SELECT menu_items.*, vendors.name AS vendorName 
     FROM menu_items 
     LEFT JOIN vendors ON menu_items.vendor_id = vendors.id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

export default router;
