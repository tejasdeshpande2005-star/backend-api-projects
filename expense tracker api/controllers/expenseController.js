const {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require("../models/expenseModel");

const addExpense = async (req, res, next) => {
    try {
        const {
            title,
            amount,
            category,
            expenseDate,
            description
        } = req.body;

        if (!title || !amount || !category || !expenseDate) {
            return res.status(400).json({
                message: "Title, amount, category and expense date are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const expense = await createExpense(
            req.user.id,
            title,
            amount,
            category,
            expenseDate,
            description
        );

        return res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        next(error);
    }
};


const getExpenses = async (req, res, next) => {
    try {
        const { category } = req.query;

        const expenses = await getExpensesByUser(
            req.user.id,
            category
        );

        return res.status(200).json({
            expenses
        });

    } catch (error) {
        next(error);
    }
};


const getExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        const expense = await getExpenseById(
            id,
            req.user.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            expense
        });

    } catch (error) {
        next(error);
    }
};

const editExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            amount,
            category,
            expenseDate,
            description
        } = req.body;

        if (!title || !amount || !category || !expenseDate) {
            return res.status(400).json({
                message: "Title, amount, category and expense date are required"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const expense = await updateExpense(
            id,
            req.user.id,
            title,
            amount,
            category,
            expenseDate,
            description
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        next(error);
    }
};
const removeExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        const expense = await deleteExpense(
            id,
            req.user.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            message: "Expense deleted successfully",
            expense
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpense,
    editExpense,
    removeExpense
};