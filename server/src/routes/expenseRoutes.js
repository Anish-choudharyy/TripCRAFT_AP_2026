import express from 'express';
import {
  getExpensesByTrip,
  createExpense,
  updateExpense,
  deleteExpense,
  getTripExpenseAnalytics,
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/trip/:tripId', getExpensesByTrip);
router.post('/trip/:tripId', createExpense);
router.get('/trip/:tripId/analytics', getTripExpenseAnalytics);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;

