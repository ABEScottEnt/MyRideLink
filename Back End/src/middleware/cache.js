const cache = (duration) => {
  return (req, res, next) => {
    // Skip caching for authenticated requests
    if (req.user) {
      return next();
    }

    // Set cache headers
    res.set('Cache-Control', `public, max-age=${duration}`);
    next();
  };
};

module.exports = cache; 