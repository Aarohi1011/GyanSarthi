// server.js
const express = require("express");
const cors = require("cors"); // Install with: npm install cors

const app = express();
const port = 3000;

// Middleware to parse JSON body and enable CORS
app.use(express.json());
app.use(cors());

let students = [
  { id: 1, name: "Aarav", age: 20 },
  { id: 2, name: "Ishita", age: 22 },
  { id: 3, name: "Rohan", age: 19 }
];

// GET request
app.get("/students", (req, res) => {
  res.json(students);
});

// POST request
app.post("/students", (req, res) => {
  const newStudent = req.body;
  students.push(newStudent);
  res.json({
    message: "✅ Student added successfully!",
    students
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});