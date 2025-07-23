const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const tokenSecret = process.env.JWT_SECRET;
  
  // Validate configuration
  if (!tokenSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    return res.status(500).json({ msg: 'Server configuration error.' });
  }

  // Get token from header or cookie
  const token = req.header('x-auth-token') || req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ msg: 'No authentication token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, tokenSecret);
    
    // Validate token structure
    if (!decoded?.user?.id) {
      console.warn('Malformed token payload:', decoded);
      return res.status(401).json({ msg: 'Invalid token structure.' });
    }

    // Check token expiration (redundant but explicit)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ msg: 'Token has expired.' });
    }

    // Attach user to request
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    
    // More specific error messages
    let msg = 'Invalid token';
    if (error.name === 'TokenExpiredError') {
      msg = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      msg = 'Malformed token';
    }

    res.status(401).json({ msg });
  }
};