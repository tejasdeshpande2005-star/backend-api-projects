const User = require("../models/user");

const createUser = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        const user = new User({
            username,
            email
        });

        await user.save();

        return res.status(201).json({
            message: "User created successfully",
            user
        });
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    createUser
};