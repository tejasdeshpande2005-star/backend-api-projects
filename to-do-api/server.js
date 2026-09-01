const express = require("express");
const app = express();
const db = require("./database");
app.use(express.json());//middleware to parse all request into json


function listTodos(req, res) {
    const todos = db.prepare("SELECT * FROM todos").all();
    res.json(todos);
}

function createTodos(req, res) {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({
            message: "Title is required and cannot be empty"
        });
    }

    const stmt = db.prepare(`
        INSERT INTO todos (title, completed)
        VALUES (?, ?)
    `);

    const result = stmt.run(req.body.title, 0);

    const todo = {
        id: result.lastInsertRowid,
        title: req.body.title,
        completed: false
    };

    res.status(201).json(todo);
}

function updateTodos(req, res) {
    const id = Number(req.params.id);

    const stmt = db.prepare(`
        UPDATE todos
        SET title = ?, completed = ?
        WHERE id = ?
    `);

    const result = stmt.run(
        req.body.title,
        req.body.completed ? 1 : 0,
        id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            message: "TODO does not exist"
        });
    }

    res.status(200).json({
        message: "TODO updated successfully"
    });
}

function deleteTodos(req, res) {
    const id = Number(req.params.id);

    const stmt = db.prepare(`
        DELETE FROM todos
        WHERE id = ?
    `);

    const result = stmt.run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "TODO does not exist"
        });
    }

    res.status(200).json({
        message: "TODO deleted successfully"
    });
}

app.get("/api/todos",listTodos);
app.post("/api/todos",createTodos);
app.put("/api/todos/:id",updateTodos);
app.delete("/api/todos/:id",deleteTodos);
 app.listen(3000,()=>{
    console.log(`Server listening at PORT 3000`);
 })