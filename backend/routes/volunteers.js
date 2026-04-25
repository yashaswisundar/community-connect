const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/volunteers
router.get('/', protect, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('-password').sort('-createdAt');
    res.json(volunteers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/volunteers/:id — update availability/skills
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
