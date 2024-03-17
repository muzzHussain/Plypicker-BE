const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const isAuthenticatedUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Please provide a valid Bearer token in the Authorization header',
    });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Please Login to access this resource',
    });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
};



const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          error: 'Unauthorized - User information not available',
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: `Role: ${req.user.role} is not allowed to access this resource`,
        });
      }
  
      next();
    };
  };
  
  
  module.exports =  {authorizeRoles,isAuthenticatedUser} ;
  