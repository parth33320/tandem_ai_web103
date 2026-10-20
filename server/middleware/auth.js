// server/middleware/auth.js - Authentication protection middleware

export const RequiresAuth = (req, res, next) => {
  const user = req.user || (req.session && req.session.user);
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  if (user) {
    req.user = user;
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please log in.' });
};

export default RequiresAuth;
