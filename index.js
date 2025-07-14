const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse incoming JSON bodies
app.use(express.json());

// Simple endpoint to log submitted text
app.post('/submit', (req, res) => {
  const { text } = req.body;
  console.log('Received text:', text);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
