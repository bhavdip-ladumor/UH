import express from 'express';
const router = express.Router();

// CORRECTED PATHS based on your e-com/ecom-seller/ structure
import ecomAuthRoutes from '../e-com/ecom-seller/auth/auth.js';

import { secureEcomService } from '../e-com/ecom-seller/auth/authMiddleware.js';
import addProductRoutes from '../e-com/ecom-seller/add-product/listing.js';
import ecomSellerWebRoutes from '../e-com/ecom-seller/ecom-seller-web.js';

router.use('/auth', ecomAuthRoutes);
router.use(secureEcomService); 
router.use('/add-product', addProductRoutes);
router.use('/', ecomSellerWebRoutes);

export default router;
