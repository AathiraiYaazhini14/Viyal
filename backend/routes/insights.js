const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');
const auth = require('../middleware/auth');

// GET /api/insights
router.get('/', auth, async (req, res) => {
  try {
    const filter = { forest: req.user.forest, officeName: req.user.officeName };
    if (req.query.category) filter.category = req.query.category;
    const insights = await Insight.find(filter).sort({ createdAt: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/insights/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const insights = await Insight.find({
      forest: req.user.forest,
      officeName: req.user.officeName,
      recommendation: { $ne: null, $ne: '' },
    }).select('category metric recommendation trend');
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
