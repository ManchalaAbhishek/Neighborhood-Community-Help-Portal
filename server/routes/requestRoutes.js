const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Create a new help request
router.post('/', async (req, res) => {
  try {
    const { requester_id, title, description, category, urgency, location } = req.body;

    const id = Math.random().toString(36).substr(2, 9);

    await db.query(
      'INSERT INTO help_requests (id, requester_id, title, description, category, urgency, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, requester_id, title, description, category, urgency, location]
    );

    const [requests] = await db.query('SELECT * FROM help_requests WHERE id = ?', [id]);
    res.status(201).json(requests[0]);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create help request' });
  }
});

// Get all help requests with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, requester_id, volunteer_id } = req.query;
    
    let query = 'SELECT * FROM help_requests WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (requester_id) {
      query += ' AND requester_id = ?';
      params.push(requester_id);
    }

    if (volunteer_id) {
      query += ' AND volunteer_id = ?';
      params.push(volunteer_id);
    }

    query += ' ORDER BY created_at DESC';

    const [requests] = await db.query(query, params);
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to get help requests' });
  }
});

// Get single help request by ID
router.get('/:id', async (req, res) => {
  try {
    const [requests] = await db.query('SELECT * FROM help_requests WHERE id = ?', [req.params.id]);
    
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(requests[0]);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to get help request' });
  }
});

// Update help request (accept, complete, cancel)
router.put('/:id', async (req, res) => {
  try {
    const { status, volunteer_id } = req.body;
    const { id } = req.params;

    let query = 'UPDATE help_requests SET status = ?';
    const params = [status];

    if (volunteer_id !== undefined) {
      query += ', volunteer_id = ?';
      params.push(volunteer_id);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    const [requests] = await db.query('SELECT * FROM help_requests WHERE id = ?', [id]);
    res.json(requests[0]);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update help request' });
  }
});

// Delete help request
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM help_requests WHERE id = ?', [req.params.id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete help request' });
  }
});

module.exports = router;
