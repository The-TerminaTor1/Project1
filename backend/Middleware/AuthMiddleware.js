const jwtUtils = require('../Utils/JwtUtils');
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwtUtils.validateToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
};

module.exports = authMiddleware;