const express = require('express');
const path = require('path');
const cache = require('../middleware/cache');

const router = express.Router();

// Serve static files with caching
router.use('/static', cache(86400), express.static(path.join(__dirname, '../public')));

// Serve images with caching
router.use('/images', cache(86400), express.static(path.join(__dirname, '../public/images')));

module.exports = router; 