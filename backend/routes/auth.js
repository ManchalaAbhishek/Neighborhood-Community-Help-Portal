const express = require("express");
const db = require("../db");
const crypto = require("crypto");

const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, role } = req.body;

  console.log("REGISTER HIT:", req.body);

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Map frontend role → DB role
  const dbRole = role === "resident" ? "requester" : "volunteer";

  const sql = `
    INSERT INTO users (id, name, role, contact_info, location)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      crypto.randomUUID(), // id
      name,
      dbRole,
      email,               // stored as contact_info
      "N/A"                // required by DB
    ],
    (err) => {
      if (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ message: "Registration failed" });
      }

      res.json({ message: "User registered successfully" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email } = req.body;

  const sql = `
    SELECT id, name, role, contact_info
    FROM users
    WHERE contact_info = ?
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("LOGIN ERROR:", err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
