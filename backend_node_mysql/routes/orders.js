import express from "express";
const router = express.Router();
import db from "../db.js";

// Place an order
router.post("/", (req, res) => {
  const { user_id, address, cartItems } = req.body;

  db.query(
    "INSERT INTO orders (user_id, address, status) VALUES (?, ?, 'placed')",
    [user_id, address],
    (err, orderResult) => {
      if (err) return res.status(500).send(err);

      const orderId = orderResult.insertId;
      const values = cartItems.map(item => [orderId, item.id, item.quantity]);

      db.query(
        "INSERT INTO order_items (order_id, item_id, quantity) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).send(err2);
          res.send({ message: "Order placed successfully", orderId });
        }
      );
    }
  );
});

// Get order history for a user
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT orders.id, orders.address, orders.status, orders.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT('name', menu_items.name, 'quantity', order_items.quantity, 'price', menu_items.price)
      ) AS items
     FROM orders
     JOIN order_items ON orders.id = order_items.order_id
     JOIN menu_items ON order_items.item_id = menu_items.id
     WHERE orders.user_id = ?
     GROUP BY orders.id
     ORDER BY orders.created_at DESC`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Get single order by id
router.get("/:orderId", (req, res) => {
  const { orderId } = req.params;
  db.query(
    `SELECT orders.id, orders.address, orders.status, orders.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT('name', menu_items.name, 'quantity', order_items.quantity, 'price', menu_items.price)
      ) AS items
     FROM orders
     JOIN order_items ON orders.id = order_items.order_id
     JOIN menu_items ON order_items.item_id = menu_items.id
     WHERE orders.id = ?
     GROUP BY orders.id`,
    [orderId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Order not found" });
      res.json(results[0]);
    }
  );
});

// Update order status (for vendors)
router.patch("/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["placed", "preparing", "on_the_way", "delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
      res.json({ success: true, status });
    }
  );
});

// Get all orders for a vendor
router.get("/vendor/:vendorId", (req, res) => {
  const { vendorId } = req.params;
  db.query(
    `SELECT orders.id, orders.address, orders.status, orders.created_at, users.name AS customerName,
      JSON_ARRAYAGG(
        JSON_OBJECT('name', menu_items.name, 'quantity', order_items.quantity, 'price', menu_items.price)
      ) AS items
     FROM orders
     JOIN order_items ON orders.id = order_items.order_id
     JOIN menu_items ON order_items.item_id = menu_items.id
     JOIN users ON orders.user_id = users.id
     WHERE menu_items.vendor_id = ?
     GROUP BY orders.id
     ORDER BY orders.created_at DESC`,
    [vendorId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

export default router;
