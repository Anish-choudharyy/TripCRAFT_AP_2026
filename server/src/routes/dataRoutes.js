import express from 'express';
import multer from 'multer';
import os from 'os';
import {
  importDestinationsCSV,
  exportTripsReportCSV,
  getPipelineAuditLogs,
} from '../controllers/dataPipelineController.js';

const router = express.Router();
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/import-destinations', upload.single('file'), importDestinationsCSV);
router.get('/export-trips-csv', exportTripsReportCSV);
router.get('/audit-logs', getPipelineAuditLogs);

export default router;

