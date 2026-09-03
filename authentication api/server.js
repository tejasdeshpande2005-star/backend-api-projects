const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());
const users = [];
let nextId = 1;

async function registerUser(req,res){
    const username = req.body.username;
    const password = req.body.password;
    if(typeof username !== "string" || typeof password !== "string" || username.trim() === "" || password.trim() === ""){
        return res.status(400).json({
            message: "Username and Password fields are required"
        })
    }
    const cleanUsername = username.trim();
    const userExists = users.some(user => user.username === cleanUsername);
    if(userExists){
        return res.status(409).json({
            message: "User already exists"
        })

    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = {id: nextId++,username: cleanUsername,password: hashedPassword,role: "user"};
    users.push(user);
    return res.status(201).json({
        message: "Registered Successfully"
    })
}

async function loginUser(req,res){
        const username = req.body.username;
        const password = req.body.password;
        if(typeof username !== "string" || typeof password !== "string" || username.trim() === "" || password.trim() === ""){
            return res.status(400).json({
                message: "Username and Password fields are required"
            })
        }
        const cleanUsername = username.trim();
        const userExists = users.some(user => user.username === cleanUsername);
        if(!userExists){
            return res.status(400).json({
            message:  "Invalid username or password"
            })
        }
        const findIndex = users.findIndex(user=>user.username === cleanUsername);
        const user = users[findIndex];
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({
                message:  "Invalid username or password"
            })
        }
        const token = jwt.sign({id: user.id,username: user.username,role:user.role},process.env.JWT_SECRET,{expiresIn: "1h"});
        return res.status(200).json({
            message: "Login Successful",
            token: token
        })

    

}

function authenticateToken(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "Access token required"
        })
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

function profile(req,res){
    return res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
}

function authorizeAdmin(req,res,next){
    const role = req.user.role;
   if(role !== "admin"){
    return res.status(403).json({
        message: "Admin Access denied"
    })
   }
   next();
}

function adminDashboard(req,res){
    return res.status(200).json({
        message: "Welcome to admin Dashboard",
        user: req.user
    })
}
app.post("/api/register",registerUser);
app.post("/api/login",loginUser);
app.get("/api/profile",authenticateToken,profile);
app.get("/api/admin",authenticateToken,authorizeAdmin,adminDashboard);

app.listen(3000,()=>{
    console.log("server listening at port 3000");
})