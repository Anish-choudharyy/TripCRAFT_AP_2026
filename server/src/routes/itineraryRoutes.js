import express from 'express';
import {
  getItineraryByTrip,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} from '../controllers/itineraryController.js';

const router = express.Router();

router.get('/trip/:tripId', getItineraryByTrip);
router.post('/trip/:tripId', createItineraryItem);
router.put('/:id', updateItineraryItem);
router.delete('/:id', deleteItineraryItem);

export default router;

