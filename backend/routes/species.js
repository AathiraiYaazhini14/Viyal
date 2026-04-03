const express = require('express');
const router = express.Router();
const Species = require('../models/Species');
const auth = require('../middleware/auth');

// GET /api/species
router.get('/', auth, async (req, res) => {
  try {
    const filter = { forest: req.user.forest, officeName: req.user.officeName };
    if (req.query.endangered === 'true') filter.isEndangered = true;
    const species = await Species.find(filter).sort({ detectedAt: -1 });
    res.json(species);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/species/:id/alert
router.patch('/:id/alert', auth, async (req, res) => {
  try {
    const species = await Species.findByIdAndUpdate(
      req.params.id,
      { alertSent: true },
      { new: true }
    );
    res.json({ message: 'Alert sent successfully', species });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
