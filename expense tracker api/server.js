const express = require("express");
require("dotenv").config();
const { connectDB }  = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Expense Tracker API is running"
    });
});

connectDB();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});