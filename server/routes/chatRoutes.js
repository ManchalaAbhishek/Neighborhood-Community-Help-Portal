const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get messages for a request
router.get('/:requestId', async (req, res) => {
  try {
    const [messages] = await db.query(
      'SELECT * FROM chat_messages WHERE request_id = ? ORDER BY timestamp ASC',
      [req.params.requestId]
    );
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/', async (req, res) => {
  try {
    const { request_id, sender_id, message } = req.body;

    const id = Math.random().toString(36).substr(2, 9);

    await db.query(
      'INSERT INTO chat_messages (id, request_id, sender_id, message) VALUES (?, ?, ?, ?)',
      [id, request_id, sender_id, message]
    );

    const [messages] = await db.query('SELECT * FROM chat_messages WHERE id = ?', [id]);
    res.status(201).json(messages[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
