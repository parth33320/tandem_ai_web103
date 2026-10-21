// server/middleware/requireAuth.js - Middleware to protect routes requiring authentication

export const requireAuth = (req, res, next) => {
  if (req.session && req.session.user && !req.user) {
    req.user = req.session.user;
  }

  if (!req.user && (!req.isAuthenticated || !req.isAuthenticated())) {
    return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
  }

  next();
};

export default requireAuth;
