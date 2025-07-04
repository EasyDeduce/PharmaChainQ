const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

let batches = [];  // In-memory storage

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

// Transfer a batch
router.post('/transfer', (req, res) => {
    const { id, recipient } = req.body;
    const batch = batches.find(b => b.id === id);

    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    batch.recipient = recipient;
    res.json({ message: 'Batch transferred successfully', batch });
});

// Flag Tamper
router.post('/flag', (req, res) => {
    const { id } = req.body;
    const batch = batches.find(b => b.id === id);

    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    batch.tampered = true;
    res.json({ message: 'Batch flagged as tampered', batch });
});

app.use('/api/batches', router);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

