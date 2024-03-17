const jwt = require('jsonwebtoken')

const getJWTToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

const sendToken = (user) => {
    const token = getJWTToken(user, user.role);
  
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    return token;
  };
  
  module.exports = sendToken;
  