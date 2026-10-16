const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/userModel");

const registerUser = async(req,res,next)=>{
    try{
        const { username,email,password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }
        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await createUser(username,email,hashedPassword);
        return res.status(201).json({
            message: "User registered successfully",
            user
        });
    }catch(error){
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
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

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser
};