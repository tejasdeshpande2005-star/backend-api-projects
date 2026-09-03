const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected");
})
.catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error);
});

app.post("/api/users",async (req,res,next)=>{
    try{
        const {username,email,age} = req.body;
        const user = new User({
            username,email,age
        });
        await user.save();
        return res.status(201).json({
            message: "User created Successfully",
            user
        });
    }
    catch(error){
        //return res.status(500).json({
          //  message: "Failed to create user"
        //});centralized error middleware
        next(error);
    }
});

app.get("/api/users",async (req,res,next)=>{
    try{
        const users = await User.find();
        return res.status(200).json({
                users: users
        });
    }
    catch(error){
        ///return res.status(500).json({
           // message: "Failed to fetch users"
        //}); centralized error middleware 
        next(error);
    }
});

app.get("/api/users/:id",async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            user: user
        });
    }
    catch(error){
        //return res.status(400).json({
          //  message: "Invalid user ID"
        //}); gone to centralized error middleware
        next(error);
    }

});

app.put("/api/users/:id",async (req,res,next)=>{
    try{
        const {username,email,age} = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {username,
            email,
            age},
            {new:true,
            runValidators:true});
            if(!user){
                return res.status(404).json({
                    message: "User not found"
                });
            }
            return res.status(200).json({
                message: "User updated successfully",
                user: user

            });
    }
    catch(error){
         // return res.status(400).json({
          //  message: "Unable to update user"
        //}); gone to centralized error middleware
        next(error); 

    }
});

app.delete("/api/users/:id",async (req,res,next)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User deleted successfully"
        });

    }catch(error){
        //return res.status(400).json({
          //  message: "Invalid user ID"
        //}); centralized error middleware
        next(error);
    }
});

app.use((err,req,res,next)=>{//centralized error middleware
    console.log(err);
    return res.status(500).json({
        message: "Something went wrong"
    });
})
app.listen(3000,()=>{
    console.log("Listening at port 3000");
})
