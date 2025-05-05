const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
    db.run(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    )
  `);
});

// Endpoints

// Serve index.html from the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// GET /tasks/ - List all tasks
app.get("/api/tasks/", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST /tasks/ - Create a task
app.post("/api/tasks/", (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    if (Math.random() < 0.75) {
        return res.status(503).json({});
    }

    db.run("INSERT INTO tasks (title) VALUES (?)", [title], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title });
    });
});



// DELETE /tasks/:taskId/ - Delete a task
app.delete("/api/tasks/:taskId/", (req, res) => {
    const { taskId } = req.params;

    if (Math.random() < 0.75) {
        return res.status(503).json({});
    }

    db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(204).send();
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});