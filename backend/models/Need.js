const mongoose = require('mongoose');

const needSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Food', 'Health', 'Education', 'Shelter', 'Employment', 'Other'],
    default: 'Other'
  },
  area: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  reportedBy: { type: String, default: 'Field Agent' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Need', needSchema);
