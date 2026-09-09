export const requireAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
};
