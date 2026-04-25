require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/needs', require('./routes/needs'));
app.use('/api/volunteers', require('./routes/volunteers'));

app.get('/health', (_, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Seed admin
    const User = require('./models/User');
    User.findOne({ email: 'admin@ngo.com' }).then(u => {
      if (!u) User.create({ name: 'NGO Admin', email: 'admin@ngo.com', password: 'Admin@123', role: 'admin' })
        .then(() => console.log('✅ Admin seeded: admin@ngo.com / Admin@123'));
    });
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('❌ DB error:', err.message); process.exit(1); });
