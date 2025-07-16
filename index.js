const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse incoming JSON bodies
app.use(express.json());

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
