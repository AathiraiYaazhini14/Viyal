const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const auth = require('../middleware/auth');

// GET /api/zones
router.get('/', auth, async (req, res) => {
  try {
    const filter = { forest: req.user.forest, officeName: req.user.officeName };
    const zones = await Zone.find(filter).sort({ riskLevel: 1 });
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/zones/logs - all activity logs across zones
router.get('/logs', auth, async (req, res) => {
  try {
    const zones = await Zone.find({
      forest: req.user.forest,
      officeName: req.user.officeName,
    }).select('name activityLogs');

    const logs = [];
    zones.forEach(zone => {
      zone.activityLogs.forEach(log => {
        logs.push({ zoneName: zone.name, ...log.toObject() });
      });
    });

    logs.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
