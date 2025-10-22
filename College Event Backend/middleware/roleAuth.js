// middleware/roleAuth.js
// ✅ This middleware restricts route access based on user roles (e.g., admin, student)

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authMiddleware)
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user information found" });
      }

      // Check if the user's role is allowed for this route
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied: Insufficient permissions" });
      }

      // Proceed to the next middleware or controller
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      res.status(500).json({ error: "Server error during role validation" });
    }
  };
};
