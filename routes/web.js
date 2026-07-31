import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Points to the "public" folder inside the root directory 2
const publicDir = path.join(__dirname, '../public'); 

// Serve all static files from the public folder
router.use(express.static(publicDir));

// Fallback to deliver index.html for main browser traffic
router.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

export default router;