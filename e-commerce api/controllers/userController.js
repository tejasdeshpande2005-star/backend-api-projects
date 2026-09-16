const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const createUser = async (req, res, next) => {
    try {
        const { username, email,password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                message: "Username must be at least 3 characters"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {      
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }
        
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        return res.status(201).json({
            message: "User created successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });
    }
    catch (error) {
        next(error);
    }
};


module.exports = {
    createUser,
    loginUser
};