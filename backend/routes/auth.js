const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/login
router.post('/login', async (req, res) => {
  const { district, forest, officeName, password } = req.body;

  if (!district || !forest || !officeName || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ district, forest, officeName });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Office not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        district: user.district,
        forest: user.forest,
        officeName: user.officeName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        district: user.district,
        forest: user.forest,
        officeName: user.officeName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
