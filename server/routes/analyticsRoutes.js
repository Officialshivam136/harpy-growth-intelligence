import express from 'express';
import {
  getBrands,
  getKpis,
  getRevenueTrends,
  getTopAsins,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/brands', getBrands);
router.get('/kpis', getKpis);
router.get('/revenue-trends', getRevenueTrends);
router.get('/top-asins', getTopAsins);

export default router;

