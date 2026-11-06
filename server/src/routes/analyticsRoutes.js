import express from 'express';
import { getGlobalDashboardAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getGlobalDashboardAnalytics);

export default router;

