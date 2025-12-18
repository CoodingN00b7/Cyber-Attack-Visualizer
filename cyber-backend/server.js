// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const scanRoutes = require('./routes/scanRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend to access
app.use(bodyParser.json());

// Routes
app.use('/api/scan', scanRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send({ status: 'System Online', region: 'Maharashtra', version: '1.0.0' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[ECEBIP] Backend running on http://localhost:${PORT}`);
    console.log(`[INFO] Loaded SHA-256 Privacy Module`);
});