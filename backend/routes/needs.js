const router = require('express').Router();
const Need = require('../models/Need');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/needs — all needs (with filters)
router.get('/', protect, async (req, res) => {
  try {
    const { category, urgency, status, area } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (status) filter.status = status;
    if (area) filter.area = new RegExp(area, 'i');
    const needs = await Need.find(filter).populate('assignedVolunteer', 'name email').sort('-createdAt');
    res.json(needs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/needs/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await Need.countDocuments();
    const open = await Need.countDocuments({ status: 'Open' });
    const critical = await Need.countDocuments({ urgency: 'Critical' });
    const resolved = await Need.countDocuments({ status: 'Resolved' });
    const byCategory = await Need.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byUrgency = await Need.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);
    res.json({ total, open, critical, resolved, byCategory, byUrgency });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/needs
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const need = await Need.create(req.body);
    res.status(201).json(need);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/needs/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const need = await Need.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedVolunteer', 'name email');
    res.json(need);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/needs/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Need.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/needs/match/:needId — smart volunteer matching
router.get('/match/:needId', protect, adminOnly, async (req, res) => {
  try {
    const need = await Need.findById(req.params.needId);
    if (!need) return res.status(404).json({ message: 'Need not found' });
    const volunteers = await User.find({ role: 'volunteer', available: true });
    // Score each volunteer
    const scored = volunteers.map((v) => {
      let score = 0;
      if (v.area && need.area && v.area.toLowerCase().includes(need.area.toLowerCase())) score += 3;
      if (v.skills?.some(s => s.toLowerCase().includes(need.category.toLowerCase()))) score += 2;
      return { ...v.toObject(), matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);
    res.json(scored.slice(0, 5));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
