const express = require('express');
const router = express.Router();

let batches = [];  // In-memory storage for now

// Create a batch
router.post('/create', (req, res) => {
    const batch = req.body;
    batches.push(batch);
    res.status(201).json({ message: 'Batch created successfully', batch });
});

// Get all batches
router.get('/', (req, res) => {
    res.json(batches);
});

module.exports = router;

