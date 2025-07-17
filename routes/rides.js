const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const auth = require('../middleware/auth');

router.post('/', auth, rideController.createRide);
router.patch('/:id', auth, rideController.updateRide);
router.delete('/:id', auth, rideController.cancelRide);
router.get('/', auth, rideController.getRides);

module.exports = router; 