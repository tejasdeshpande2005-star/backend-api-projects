const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MONGO DB CONNECTED")
}).catch((error)=>{
    console.log("MONGO DB NOT CONNECTED");
    console.log(error);
});

app.get("/", (req, res) => {
    res.json({
        message: "E-commerce API is running"
    });
});

app.use("/api/products",productRoutes);
app.use("/api/carts",cartRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000,()=>{console.log("SERVER 3000")});