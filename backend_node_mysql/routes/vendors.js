import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all menu items for a vendor
router.get("/:vendorId/menu-items", (req, res) => {
  const { vendorId } = req.params;
  db.query(
    "SELECT * FROM menu_items WHERE vendor_id = ?",
    [vendorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add a new menu item
router.post("/:vendorId/menu-items", (req, res) => {
  const { vendorId } = req.params;
  const { name, description, price, image, category } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO menu_items (name, description, price, image, category, vendor_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, image, category, vendorId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, description, price, image, category, vendorId });
    }
  );
});

// Update a menu item
router.put("/:vendorId/menu-items/:itemId", (req, res) => {
  const { vendorId, itemId } = req.params;
  const { name, description, price, image, category } = req.body;

  db.query(
    "UPDATE menu_items SET name=?, description=?, price=?, image=?, category=? WHERE id=? AND vendor_id=?",
    [name, description, price, image, category, itemId, vendorId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
      res.json({ id: parseInt(itemId), name, description, price, image, category, vendorId });
    }
  );
});

// Delete a menu item
router.delete("/:vendorId/menu-items/:itemId", (req, res) => {
  const { vendorId, itemId } = req.params;
  db.query(
    "DELETE FROM menu_items WHERE id = ? AND vendor_id = ?",
    [itemId, vendorId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Menu item not found" });
      res.json({ success: true });
    }
  );
});

export default router;
