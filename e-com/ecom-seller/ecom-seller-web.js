import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { secureEcomService } from './auth/authMiddleware.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../../public'); // Adjust path to point to your 'public' folder

// All routes here are automatically "E-commerce" related
// You can apply the middleware to the whole router
router.use(secureEcomService);

router.get('/add-product.html', (req, res) => {
    res.sendFile(path.join(publicDir, 'services/e-com/add-product/add-product.html'));
});

router.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(publicDir, 'dashboard.html'));
});

export default router;