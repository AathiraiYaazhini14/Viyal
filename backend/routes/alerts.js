const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// GET /api/alerts
router.get('/', auth, async (req, res) => {
  try {
    const { type, severity, status } = req.query;
    const filter = {
      forest: req.user.forest,
      officeName: req.user.officeName,
    };
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/alerts/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const filter = { forest: req.user.forest, officeName: req.user.officeName };
    const total = await Alert.countDocuments(filter);
    const active = await Alert.countDocuments({ ...filter, status: 'Active' });
    const high = await Alert.countDocuments({ ...filter, severity: 'High' });
    const resolved = await Alert.countDocuments({ ...filter, status: 'Resolved' });
    res.json({ total, active, high, resolved });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/alerts/:id/status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
