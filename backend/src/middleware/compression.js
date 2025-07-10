const compression = require('compression');

// Compression options
const compressionOptions = {
  // Only compress responses larger than 1kb
  threshold: 1024,
  // Don't compress responses for these content types
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  // Compression level (1-9, 9 being highest)
  level: 6
};

// Compression middleware
const compressionMiddleware = compression(compressionOptions);

module.exports = compressionMiddleware; 