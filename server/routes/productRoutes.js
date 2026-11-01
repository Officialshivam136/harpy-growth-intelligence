import express from 'express';
import { getProducts, getProductByAsin } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:asin', getProductByAsin);

export default router;

