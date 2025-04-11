const User = require('../model/User');

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

const updatePassword = async (email, password) => {
    await User.updateOne({ email }, { $set: { password: password } });
}
//added createUser function
const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

module.exports = {
    findUserByEmail,
    updatePassword,
    createUser
};

module.exports = {
    findUserByEmail,
    updatePassword
}