const { pool } = require("../config/db");

const createExpense = async (
    userId,
    title,
    amount,
    category,
    expenseDate,
    description
) => {
    const result = await pool.query(
        `INSERT INTO expenses
        (user_id, title, amount, category, expense_date, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            userId,
            title,
            amount,
            category,
            expenseDate,
            description
        ]
    );

    return result.rows[0];
};


const getExpensesByUser = async (userId, category) => {
    let query = `
        SELECT *
        FROM expenses
        WHERE user_id = $1
    `;

    const values = [userId];

    // Add category filter only when provided
    if (category) {
        query += ` AND category = $2`;
        values.push(category);
    }

    query += ` ORDER BY expense_date DESC, id DESC`;

    const result = await pool.query(query, values);

    return result.rows;
};


const getExpenseById = async (expenseId, userId) => {
    const result = await pool.query(
        `SELECT *
         FROM expenses
         WHERE id = $1 AND user_id = $2`,
        [expenseId, userId]
    );

    return result.rows[0];
};

const updateExpense = async (
    expenseId,
    userId,
    title,
    amount,
    category,
    expenseDate,
    description
) => {
    const result = await pool.query(
        `UPDATE expenses
         SET title = $1,
             amount = $2,
             category = $3,
             expense_date = $4,
             description = $5
         WHERE id = $6
           AND user_id = $7
         RETURNING *`,
        [
            title,
            amount,
            category,
            expenseDate,
            description,
            expenseId,
            userId
        ]
    );

    return result.rows[0];
};

const deleteExpense = async (expenseId, userId) => {
    const result = await pool.query(
        `DELETE FROM expenses
         WHERE id = $1
           AND user_id = $2
         RETURNING *`,
        [expenseId, userId]
    );

    return result.rows[0];
};


module.exports = {
    createExpense,
    getExpensesByUser,
    getExpenseById,
    updateExpense,
    deleteExpense
};