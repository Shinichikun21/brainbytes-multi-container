const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const tokenSecret = process.env.JWT_SECRET;
  if (!tokenSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    return res.status(500).json({ msg: 'Server configuration error.' });
  }
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied.' });
  }
  try {
    const decoded = jwt.verify(token, tokenSecret);
    if (!decoded.user || !decoded.user.id) {
       return res.status(401).json({ msg: 'Token is not valid (malformed payload).' });
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid.' });
  }
};