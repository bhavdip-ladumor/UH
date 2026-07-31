import express from 'express';
import { fetchCategories, fetchFields, saveProduct } from './listingController.js';

const router = express.Router();

router.get('/categories', fetchCategories); // ?parentId=1
router.get('/fields/:categoryId', fetchFields);
router.post('/save', saveProduct);

export default router;