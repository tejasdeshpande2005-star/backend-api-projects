const express = require("express");
const  mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MONGO DB CONNECTED");
}).catch((error)=>{
    console.log("MONGO DB NOT CONNECTED");
    console.log(error);
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);



app.use((err, req, res, next) => {

    console.log(err);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(409).json({
            message: "Username or email already exists"
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID"
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message
        });
    }

    // Unknown/unexpected error
    return res.status(500).json({
        message: "Something went wrong"
    });
});

app.listen(3000,()=>{console.log("SERVER 3000")});