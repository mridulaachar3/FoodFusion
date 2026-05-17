import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "foodfusion_secret_key";

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, address, userType, contact } = req.body;

  if (!name || !email || !password || !address || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, address],
      (err, userResult) => {
        if (err) return res.status(500).json({ error: err.message });

        if (userType === "vendor") {
          db.query(
            "INSERT INTO vendors (name, email, location, contact) VALUES (?, ?, ?, ?)",
            [name, email, address, contact || ""],
            (err, vendorResult) => {
              if (err) return res.status(500).json({ error: err.message });
              const token = jwt.sign({ id: vendorResult.insertId, email, userType }, JWT_SECRET, { expiresIn: "7d" });
              res.json({ id: vendorResult.insertId, name, email, address, userType, token });
            }
          );
        } else {
          const token = jwt.sign({ id: userResult.insertId, email, userType }, JWT_SECRET, { expiresIn: "7d" });
          res.json({ id: userResult.insertId, name, email, address, userType, token });
        }
      }
    );
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

    // If vendor, get vendor id
    if (userType === "vendor") {
      db.query("SELECT * FROM vendors WHERE email = ?", [email], (err, vendorResults) => {
        if (err) return res.status(500).json({ error: err.message });
        const vendorId = vendorResults.length > 0 ? vendorResults[0].id : user.id;
        const token = jwt.sign({ id: vendorId, email, userType }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ id: vendorId, name: user.name, email: user.email, address: user.address, userType, token });
      });
    } else {
      const token = jwt.sign({ id: user.id, email, userType }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ id: user.id, name: user.name, email: user.email, address: user.address, userType, token });
    }
  });
});

export default router;
