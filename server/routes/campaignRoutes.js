import express from 'express';
import { getCampaigns, getCampaignAnalysis } from '../controllers/campaignController.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/analysis', getCampaignAnalysis);

export default router;

