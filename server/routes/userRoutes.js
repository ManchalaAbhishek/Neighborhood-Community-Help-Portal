const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, role, contact_info, location } = req.body;

    // Check if user already exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE contact_info = ?',
      [contact_info]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'User with this contact info already exists. Please login.' });
    }

    // Generate ID
    const id = Math.random().toString(36).substr(2, 9);
    
    // Insert new user
    await db.query(
      'INSERT INTO users (id, name, role, contact_info, location) VALUES (?, ?, ?, ?, ?)',
      [id, name, role, contact_info, location]
    );

    // Fetch and return the created user
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { contact_info } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE contact_info = ?',
      [contact_info]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found. Please check your contact info or create an account.' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
