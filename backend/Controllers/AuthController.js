const bcrypt = require('bcryptjs');
const otpGenerator = require('../Utils/OtpUtils');
const jwtUtils = require('../Utils/JwtUtils');
const mailUitils = require('../Utils/MailUtils');
const userRepository = require('../Repository/UserRepository');
const otpRepository = require('../Repository/OtpRepository');
const User = require('../model/User');
const dotenv = require('dotenv').config()

const emailTemplate = (otp) => {
    return `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">

            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your login</title>
            <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
            </head>

            <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
            <table role="presentation"
                style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                <tbody>
                <tr>
                    <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                    <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                        <tbody>
                        <tr>
                            <td style="padding: 40px 0px 0px;">
                            <div style="text-align: left;">
                                <div style="padding-bottom: 20px;"><img
                                    src="https://assets.mailmeteorusercontent.com/tools/email-signature-generator/mailmeteor-logo.png" alt="Company"
                                    style="width: 56px;"></div>
                            </div>
                            <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                <div style="color: rgb(0, 0, 0); text-align: left;">
                                <h1 style="margin: 1rem 0">Verification code</h1>
                                <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                                <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                                <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                                <p style="padding-bottom: 16px">Thanks,<br>The Mailmeteor team</p>
                                </div>
                            </div>
                            <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                                <p style="padding-bottom: 16px">Made with ♥ in Paris</p>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </td>
                </tr>
                </tbody>
            </table>
            </body>

            </html>
    `
}

const getEmailForgotPasswordTokenMethod = (email, otp) => {
    const jwtToken = jwtUtils.generateToken({
        email: user.email,
        otp: rawOtp
    }, '5m');

    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 3000;

    const resetUrl = `${protocol}://${host}:${port}/api/reset-password/${jwtToken}`;

    return `Click on the following link to reset your password: ${resetUrl}`;
}

const getEmailForgotPasswordOtpMethod = (otp) => {

    return `Click on the following link to reset your password: ${otp}`;
}

// Register
const registerUser = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        // const existing = await User.findOne({ email });
        // if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ first_name, last_name, email, password: hashed });

        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        next(err);
    }
};

// Login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwtUtils.generateToken({ id: user._id, email: user.email });
        res.json({ token, user });
    } catch (err) {
        next(err);
    }
};

/**
 * Reqeust must contains email
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        const rawotp = otpGenerator.generateOtp();
        const hashedOtp = await bcrypt.hash(rawotp, 10);

        await otpRepository.upsertOtpByEmail(email, { otp: hashedOtp, createdAt: Date.now() });

        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            html: emailTemplate(rawotp),
        };

        await mailUitils.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        next(err);
    }
}

/**
 * Reqeust must contains email and OTP
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email or OTP missing' });
        }

        const storedOtp = await otpRepository.findOtpByEmail(email);
        if (!storedOtp) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isOtpValid = await bcrypt.compare(otp, storedOtp.otp);
        if (!isOtpValid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({ message: 'OTP verified' });
    } catch (err) {
        next(err);
    }
}

/**
 * Reqeust must contains email
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
//TODO: add password validation
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'User not exist' });
        }

        const rawOtp = otpGenerator.generateOtp();
        const hashedOtp = await bcrypt.hash(rawOtp, 10);

        await otpRepository.upsertOtpByEmail(email, { otp: hashedOtp, createdAt: Date.now() });

        const mailOptions = {
            to: user.email,
            subject: 'Password Reset',
            html: getEmailForgotPasswordOtpMethod(rawOtp),
        };

        await mailUitils.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        next(err);
    }
}

/**
 * Request must contains Token in pathVariable,
 * and password in request body
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const resetPasswordWithToken = async (req, res, next) => {
    try {
        const jwtToken = req.params.token;
        const { password } = req.body;

        if (jwtToken == null || password == null) {
            return res.status(400).json({ message: 'Invalid Input' });
        }

        let decoded;
        try {
            decoded = jwtUtils.validateToken(jwtToken);
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        const { email, otp } = decoded;
        const storedOtp = await otpRepository.findOtpByEmail(email);

        if (!storedOtp) {
            res.status(400).json({ error: 'OTP is invalid or has expired' });
        }

        const isOtpValid = await bcrypt.compare(otp, storedToken.otp);

        if (!isOtpValid) {
            res.status(400).json({ error: 'OTP is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
}

/**
 * Request must contains email, otp, password in body
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const resetPasswordWithOtp = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            return res.status(400).json({ message: 'Invalid Input' });
        }

        const storedOtp = await otpRepository.findOtpByEmail(email);
        if (!storedOtp) {
            return res.status(403).json({ message: 'Invalid or expired OTP' });
        }
        const isOtpValid = await bcrypt.compare(otp, storedOtp.otp);
        if (!isOtpValid) {
            return res.status(403).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
}

/**
 * Request body must contain curPassword and newPassword
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const resetPassword = async (req, res, next) => {
    // const authHeader = req.headers.authorization;
    const { curPassword, newPassword } = req.body;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Unauthorized - no token provided' });
    // }

    if (!newPassword || !curPassword) {
        return res.status(400).json({ message: 'Current passwrod or new password not provided' });
    }

    // const jwtToken = authHeader.split(' ')[1];
    try {
        // const decoded = jwtUtils.validateToken(jwtToken);
        const email = req.user.email;

        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User not exist' });;
        }

        const isCorrectPassword = await bcrypt.compare(curPassword, user.password);
        if (!isCorrectPassword) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userRepository.updatePassword(email, hashedPassword);
        return res.status(200).json({ message: 'Password Updated' });
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};

module.exports = {
    registerUser,
    loginUser,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPasswordWithToken,
    resetPasswordWithOtp,
    resetPassword,
    getProfile,
}
