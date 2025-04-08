const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendMail = async (mailOptions) => {
    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail,
}