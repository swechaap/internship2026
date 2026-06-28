import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load database from file
let db = {
  passwordsStore: {},
  users: [],
  flowEvents: [],
  records: []
};

try {
  if (fs.existsSync(DB_PATH)) {
    db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    console.log('Database loaded successfully from db.json');
  } else {
    console.warn('db.json not found! Running with empty defaults.');
  }
} catch (e) {
  console.error('Failed to load database file:', e);
}

// Helper to save database updates
const saveDb = () => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save database update:', e);
  }
};

// ----------------- AUTHENTICATION APIS -----------------

// Fetch passwords store
app.get('/api/passwords', (req, res) => {
  res.json(db.passwordsStore);
});

// Verify passcode credentials
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  
  if (!role) {
    return res.status(400).json({ success: false, message: 'Role parameter is required.' });
  }

  const expectedPassword = db.passwordsStore[role];
  if (!expectedPassword) {
    return res.status(404).json({ success: false, message: `No passkey stored for ${role} role.` });
  }

  // Compare case-insensitively and trimmed to match frontend changes
  if (password.trim().toLowerCase() === expectedPassword.trim().toLowerCase()) {
    res.json({
      success: true,
      role,
      token: `mock-jwt-token-for-${role.toLowerCase()}`
    });
  } else {
    res.status(401).json({
      success: false,
      message: `Invalid credentials. Please enter the correct passcode for the ${role} portal.`
    });
  }
});

// Reset credentials passkey
app.post('/api/reset-password', (req, res) => {
  const { role, newPassword } = req.body;

  if (!role || !newPassword) {
    return res.status(400).json({ success: false, message: 'Role and newPassword are required.' });
  }

  db.passwordsStore[role] = newPassword;
  saveDb();
  
  console.log(`[AUTH] Reset passcode for role "${role}" updated to: ${newPassword}`);
  res.json({ success: true, message: `Password for ${role} reset successfully!` });
});


// ----------------- PATIENT FLOW / ACCOUNTS APIS -----------------

// Fetch flow logs
app.get('/api/flow-events', (req, res) => {
  res.json(db.flowEvents);
});

// Create flow log
app.post('/api/flow-events', (req, res) => {
  const { name, type, room, amount } = req.body;
  if (!name || !type || !room) {
    return res.status(400).json({ success: false, message: 'Name, type, and room are required.' });
  }

  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const billingCode = 'TX-' + Math.floor(1000 + Math.random() * 9000);

  const newEvent = {
    id: `flow-${Date.now()}`,
    name,
    type,
    room,
    time,
    date,
    billingCode,
    amount: parseFloat(amount) || 0
  };

  db.flowEvents.push(newEvent);
  saveDb();
  res.status(201).json({ success: true, event: newEvent });
});


// ----------------- USERS DIRECTORY APIS -----------------

// Fetch user directory list
app.get('/api/users', (req, res) => {
  res.json(db.users);
});

// Create user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.role || !newUser.email) {
    return res.status(400).json({ success: false, message: 'Name, role, and email are required.' });
  }

  newUser.id = `usr-${Date.now()}`;
  if (!newUser.status) newUser.status = 'Active';

  db.users.unshift(newUser);
  saveDb();
  res.status(201).json(newUser);
});

// Update user details
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  db.users = db.users.map(u => u.id === id ? { ...u, ...updatedUser } : u);
  saveDb();
  res.json({ ...updatedUser, id });
});

// Remove user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.users = db.users.filter(u => u.id !== id);
  saveDb();
  res.json({ success: true, message: `User ${id} removed successfully.` });
});


// ----------------- MEDICAL RECORDS APIS -----------------

// Fetch medical records list
app.get('/api/records', (req, res) => {
  res.json(db.records);
});

// Create medical record
app.post('/api/records', (req, res) => {
  const newRecord = req.body;
  if (!newRecord.patientName || !newRecord.title || !newRecord.recordType) {
    return res.status(400).json({ success: false, message: 'patientName, title, and recordType are required.' });
  }

  newRecord.id = `rec-${Date.now()}`;
  db.records.unshift(newRecord);
  saveDb();
  res.status(201).json(newRecord);
});

// Update medical record
app.put('/api/records/:id', (req, res) => {
  const { id } = req.params;
  const updatedRecord = req.body;

  db.records = db.records.map(r => r.id === id ? { ...r, ...updatedRecord } : r);
  saveDb();
  res.json({ ...updatedRecord, id });
});

// Remove medical record
app.delete('/api/records/:id', (req, res) => {
  const { id } = req.params;
  db.records = db.records.filter(r => r.id !== id);
  saveDb();
  res.json({ success: true, message: `Record ${id} removed successfully.` });
});

// Start listening
app.listen(PORT, () => {
  console.log(`CarePortal Mock Backend server running at http://localhost:${PORT}`);
});
