import express from "express";
import {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudentGrade,
  deleteStudent,
  searchStudentsByName,
} from "../services/studentService.js";

const router = express.Router();

// Middleware to parse JSON body
router.use(express.json());

// Get all students
router.get("/", async (req, res) => {
  try {
    const response = await getAllStudents();
    if (response.success) {
      return res.status(200).send({ data: response.data });
    } else throw new Error("Error in get api");
  } catch (err) {
    console.log("get api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

// Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const response = await getStudentById(id);
    if (response.success) {
      return res.status(200).send({ data: response.data });
    } else {
      return res.status(404).send({ message: response.error.message });
    }
  } catch (err) {
    console.log("get by id api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

// Create a new student
router.post("/", async (req, res) => {
  try {
    const { name, age, grade } = req.body;

    // Validate input
    if (!name || !age || !grade) {
      return res
        .status(400)
        .send({
          message: "Missing required fields: name, age, and grade are required",
        });
    }

    if (typeof age !== "number" || age <= 0) {
      return res.status(400).send({ message: "Age must be a positive number" });
    }

    const response = await createStudent(name, age, grade);
    if (response.success) {
      return res.status(201).send({ data: response.data });
    } else throw new Error("Error creating student");
  } catch (err) {
    console.log("create api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

// Update a student's grade
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { grade } = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    if (!grade) {
      return res.status(400).send({ message: "Grade is required" });
    }

    const response = await updateStudentGrade(id, grade);
    if (response.success) {
      return res.status(200).send({ data: response.data });
    } else {
      return res.status(404).send({ message: response.error.message });
    }
  } catch (err) {
    console.log("update api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const response = await deleteStudent(id);
    if (response.success) {
      return res.status(200).send({ data: response.data });
    } else {
      return res.status(404).send({ message: response.error.message });
    }
  } catch (err) {
    console.log("delete api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

// Search students by name
router.get("/search/:name", async (req, res) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).send({ message: "Name is required for search" });
    }

    const response = await searchStudentsByName(name);
    if (response.success) {
      return res.status(200).send({ data: response.data });
    } else throw new Error("Error in search api");
  } catch (err) {
    console.log("search api controller catch ", err);
    return res.status(400).send({ message: err.message || "" });
  }
});

export default router;
