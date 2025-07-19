const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

// Supabase configuration passed to the client
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse incoming JSON bodies
app.use(express.json());

// Serve a small script with Supabase credentials
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};\nwindow.SUPABASE_KEY = ${JSON.stringify(SUPABASE_KEY)};`);
});

// Endpoint to handle uploaded image and log its size
app.post('/submit', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.log('No image uploaded');
    return res.sendStatus(400);
  }
  console.log('Received image of size:', req.file.size);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
