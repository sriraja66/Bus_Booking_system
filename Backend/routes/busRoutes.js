import express from 'express';
import {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  searchBuses
} from '../controllers/busController.js';

const router = express.Router();

// Routes for /api/buses/search
router.route('/search')
  .get(searchBuses);

// Routes for /api/buses
router.route('/')
  .post(createBus)
  .get(getAllBuses);

// Routes for /api/buses/:id
router.route('/:id')
  .get(getBusById)
  .put(updateBus)
  .delete(deleteBus);

export default router;
