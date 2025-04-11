const bcrypt = require('bcryptjs');
const jwtUtils = require('../Utils/JwtUtils');
const mailUitils = require('../Utils/MailUtils');
const userRepository = require('../Repository/UserRepository');
const otpRepository = require('../Repository/OtpRepository')
const dotenv = require('dotenv').config()


//TODO: add password validation
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const userExist = await userRepository.findUserByEmail(email);
    if (!userExist) {
        return res.status(400).json({ message: 'User not exist' });
    }

    //TODO use otp function to get otp
    //create token
    const rawOtp = "123456";
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    //save to db
    await otpRepository.upsertOtpByEmail(email, { otp: hashedOtp, createdAt: Date.now() });

    const jwtToken = jwtUtils.generateToken({
        email: userExist.email,
        otp: rawOtp
    }, '5m');

    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 3000;

    const resetUrl = `${protocol}://${host}:${port}/api/reset-password/${jwtToken}`;

    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        text: `Click on the following link to reset your password: ${resetUrl}`,
    };

    try {
        await mailUitils.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
}

exports.resetPasswordWithToken = async (req, res) => {
    const jwtToken = req.params.token;
    const { password } = req.body;

    console.log(jwtToken);

    if (jwtToken == null || password == null) {
        return res.status(400).json({ message: 'Invalid Input' });
    }

    try {
        const decoded = jwtUtils.validateToken(jwtToken);
        const { email, otp } = decoded;
        const storedOtp = await otpRepository.findOtpByEmail(email);

        if (!storedOtp) {
            return res.status(400).json({ message: 'Otp has expired' });
        }

        const isOtpValid = await bcrypt.compare(otp, storedToken.otp);

        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid otp' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

exports.resetPasswordWithOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Invalid Input' });
    }
    try {
        const storedOtp = await otpRepository.findOtpByEmail(email);
        if (!storedOtp) {
            return res.status(400).json({ message: 'Otp has expired' });
        }

        const isOtpValid = await bcrypt.compare(otp, storedToken.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid otp' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRepository.updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
}

exports.resetPassword = async (req, res) => {
    const authHeader = req.headers.authorization;
    const password = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - no token provided' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password not provided' });
    }

    const jwtToken = authHeader.split(' ')[1];
    try {
        const decoded = jwtUtils.validateToken(jwtToken);

        const email = decoded.email;
        const hashedPassword = await bcrypt.hash(password, 10);

        await userRepository.updatePassword(email, hashedPassword);
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

//register and login controller
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.createUser({
            email,
            password: hashedPassword,
            isVerified: false,
        });

        const token = jwtUtils.generateToken({ email: newUser.email });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwtUtils.generateToken({ email: user.email });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
