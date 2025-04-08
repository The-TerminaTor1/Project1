const Otp = require('../model/Otp');

const findOtpByEmail = async (email) => {
    const otp = await Otp.findOne({ email });
    return otp;
}

const upsertOtpByEmail = async (email, otp) => {
    const updatedOtp = await Otp.findOneAndUpdate(
        { email: email },
        otp,
        { upsert: true, new: true },
    );
    return updatedOtp;
}

module.exports = {
    findOtpByEmail,
    upsertOtpByEmail
}