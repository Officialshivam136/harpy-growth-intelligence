import express from 'express';
import {
  analyzeQuery,
  getSuggestions,
  getStatus,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/analyze', analyzeQuery);
router.get('/suggestions', getSuggestions);
router.get('/status', getStatus);

export default router;

