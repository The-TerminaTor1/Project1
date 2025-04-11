const jwt = require('jsonwebtoken');
<<<<<<< HEAD

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { generateToken };
=======
const dotenv = require('dotenv').config()

const generateToken = (payload, expiresIn = '1d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
}

//throw exception if token is exp or invalid
const validateToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    validateToken,
}
>>>>>>> 94f95e0b1d0657b9301f6f9769fc621664f55b00
