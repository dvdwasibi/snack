import express, { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const upload = multer();

// Supabase configuration passed to the client
const SUPABASE_URL: string = process.env.SUPABASE_DB_URL || '';
const SUPABASE_KEY: string = process.env.SUPABASE_KEY || '';

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse incoming JSON bodies
app.use(express.json());

// Serve a small script with Supabase credentials
app.get('/config.js', (req: Request, res: Response) => {
  res.type('application/javascript');
  res.send(
    `window.SUPABASE_URL = ${JSON.stringify(SUPABASE_URL)};\nwindow.SUPABASE_KEY = ${JSON.stringify(
      SUPABASE_KEY
    )};`
  );
});

// Endpoint to handle uploaded image and log its size
app.post('/submit', upload.single('image'), (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    console.log('No image uploaded');
    return res.sendStatus(400);
  }
  console.log('Received image of size:', file.size);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
