const User = require('../model/User');

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

const updatePassword = async (email, password) => {
    await User.updateOne({ email }, { $set: { password: password } });
}

module.exports = {
    findUserByEmail,
    updatePassword
}