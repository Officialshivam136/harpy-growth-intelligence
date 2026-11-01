import express from 'express';
import {
  getAlerts,
  getAlertSummary,
  getAlertRules,
  markAlertRead,
  markAllAlertsRead,
  resolveAlert,
  reopenAlert,
} from '../controllers/alertController.js';

const router = express.Router();

router.get('/', getAlerts);
router.get('/summary', getAlertSummary);
router.get('/rules', getAlertRules);
router.patch('/:id/read', markAlertRead);
router.post('/mark-all-read', markAllAlertsRead);
router.patch('/:id/resolve', resolveAlert);
router.patch('/:id/reopen', reopenAlert);

export default router;

