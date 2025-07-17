const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, userController.getMe);
router.patch('/me', auth, userController.updateMe);
router.get('/nearby-drivers', auth, userController.getNearbyDrivers);

module.exports = router; 