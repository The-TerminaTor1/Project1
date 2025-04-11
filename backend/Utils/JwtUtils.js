const jwt = require('jsonwebtoken');
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