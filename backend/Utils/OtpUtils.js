const crypto = require('crypto');

const generateOtp = (num=6) => {
    let otp = "";
    for (let i = 0; i < num; i++) {
        otp += crypto.randomInt(10); 
    }
    return otp;
}

module.exports = {
    generateOtp,
}