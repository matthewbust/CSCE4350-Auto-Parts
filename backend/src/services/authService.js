const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });
};

const formatUserWithToken = (userObj, token) => {
  return { ...userObj, token };
};

module.exports = { createToken, formatUserWithToken };
