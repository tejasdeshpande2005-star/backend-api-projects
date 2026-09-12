const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const createUser = async (req, res, next) => {
    try {
        const { username, email,password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            username,
            email,
            password: hashedPassword
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

const loginUser = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
            id: user._id
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
    catch(error){
        next(error);
    }

};


module.exports = {
    createUser,
    loginUser
};