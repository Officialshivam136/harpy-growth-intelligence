import express from 'express';
import {
  validateImport,
  processImport,
  getImportHistory,
  getSampleTemplate,
} from '../controllers/importController.js';

const router = express.Router();

router.post('/validate', validateImport);
router.post('/process', processImport);
router.get('/history', getImportHistory);
router.get('/template/:type', getSampleTemplate);

export default router;
