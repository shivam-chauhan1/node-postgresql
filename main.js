import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudentGrade,
  deleteStudent,
  searchStudentsByName,
} from "./api/v1/services/studentService.js";

// Test function to run all CRUD operations
const testCrudOperations = async () => {
  try {
    console.log("===== Testing CRUD Operations =====");

    // Create a student
    console.log("\n--- Creating a new student ---");
    const newStudent = await createStudent("John Doe", 15, "Grade 10");
    console.log("New student created:", newStudent.data);

    // Get all students
    console.log("\n--- Getting all students ---");
    const allStudents = await getAllStudents();
    console.log("All students:", allStudents.data);

    // Get student by ID
    console.log("\n--- Getting student by ID ---");
    const studentId = newStudent.data.id;
    const student = await getStudentById(studentId);
    console.log("Student with ID", studentId, ":", student.data);

    // Update student's grade
    console.log("\n--- Updating student's grade ---");
    const updatedStudent = await updateStudentGrade(studentId, "Grade 11");
    console.log("Updated student:", updatedStudent.data);

    // Search students by name
    console.log("\n--- Searching students by name ---");
    const searchResults = await searchStudentsByName("John");
    console.log("Search results:", searchResults.data);

    // Delete the student
    console.log("\n--- Deleting the student ---");
    const deletedStudent = await deleteStudent(studentId);
    console.log("Deleted student:", deletedStudent.data);

    // Verify the student was deleted
    console.log("\n--- Verifying deletion ---");
    const afterDelete = await getAllStudents();
    console.log("All students after deletion:", afterDelete.data);

    console.log("\n===== CRUD Operations Testing Complete =====");
  } catch (error) {
    console.error("Error during CRUD operations testing:", error);
  }
};

// Run the test
testCrudOperations();
