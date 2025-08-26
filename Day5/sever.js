// Import express
const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Dummy list of students
let students = [
  { id: 1, name: "Aarav", age: 20 },
  { id: 2, name: "Ishita", age: 22 },
  { id: 3, name: "Rohan", age: 19 }
];

// ========== ROUTES ==========

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Day 5: Express.js Basics 🚀");
});

// GET route → return all students
app.get("/students", (req, res) => {
  res.json(students);
});

// POST route → add a new student
app.post("/students", (req, res) => {
  const newStudent = req.body; // read JSON data from request
  students.push(newStudent);
  res.json({ message: "Student added successfully!", students });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
