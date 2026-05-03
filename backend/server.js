const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'finance_super_secret_key'; // For dev purposes

app.use(cors());
app.use(express.json());

// --- Auth Routes ---

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      const user = { id: this.lastID, name, email };
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
      
      res.status(201).json({ user, token });
    });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
    
    // Return user without password
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email },
      token 
    });
  });
});

// --- Middleware to protect transaction routes ---
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// --- Transaction Routes ---

// Get transactions for logged-in user
app.get('/api/transactions', authMiddleware, (req, res) => {
  db.all('SELECT * FROM transactions WHERE userId = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a transaction
app.post('/api/transactions', authMiddleware, (req, res) => {
  const { type, amount, category, date, description } = req.body;
  const id = crypto.randomUUID();
  
  db.run(
    'INSERT INTO transactions (id, userId, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, req.userId, type, amount, category, date, description],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, userId: req.userId, type, amount, category, date, description });
    }
  );
});

// Delete a transaction
app.delete('/api/transactions/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  
  // Verify ownership before deleting
  db.get('SELECT userId FROM transactions WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Transaction not found' });
    if (row.userId !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    db.run('DELETE FROM transactions WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Transaction deleted successfully', id });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
