const express = require("express");

const {
    addExpense,
    getExpenses,
    getExpense,
    editExpense,
    removeExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/",authMiddleware,getExpenses);
router.get("/:id", authMiddleware, getExpense);
router.put("/:id", authMiddleware, editExpense);
router.delete("/:id", authMiddleware, removeExpense);

module.exports = router;