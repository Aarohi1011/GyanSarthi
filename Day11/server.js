import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000; // backend will run on localhost:5000

// Middleware
app.use(cors());
app.use(express.json()); // allow JSON body parsing

// In-memory database (temporary)
// Later you can replace with MongoDB/MySQL
let students = [
  { id: 1, name: "Aarohi", age: 21, course: "B.Tech" },
  { id: 2, name: "Rohit", age: 22, course: "MBA" }
];

// ✅ GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// ✅ GET single student by id
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
});

// ✅ POST - Add new student
app.post("/students", (req, res) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newStudent = {
    id: students.length + 1,
    name,
    age,
    course
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// ✅ PUT - Update student by id
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, age, course } = req.body;
  if (name) student.name = name;
  if (age) student.age = age;
  if (course) student.course = course;

  res.json(student);
});

// ✅ DELETE - Remove student by id
app.delete("/students/:id", (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deletedStudent = students.splice(studentIndex, 1);
  res.json({ message: "Student deleted", student: deletedStudent });
});

// ✅ Run Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
