// sessionAuth.js
// Requires express-session and a durable session store (Redis, Postgres, etc.)
module.exports = {
  ensureSession: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.id) {
      req.user = req.session.user;
      return next();
    }
    return res.status(401).json({ error: 'unauthenticated' });
  }
};