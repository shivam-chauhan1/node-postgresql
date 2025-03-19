import pool from "../../db/index.js";

export const getAllStudents = async () => {
  try {
    const result = await pool.query("SELECT * FROM students", []);
    console.log("query response ", result);
    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log("error in select query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};

// Create - Add a new student
export const createStudent = async (name, age, grade) => {
  try {
    const query =
      "INSERT INTO students (name, age, grade) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, age, grade];
    const result = await pool.query(query, values);

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error in insert query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};

// Read - Get a student by ID
export const getStudentById = async (id) => {
  try {
    const query = "SELECT * FROM students WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: new Error("Student not found"),
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error in select by id query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};

// Update - Update a student's grade
export const updateStudentGrade = async (id, grade) => {
  try {
    const query = "UPDATE students SET grade = $1 WHERE id = $2 RETURNING *";
    const values = [grade, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: new Error("Student not found"),
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error in update query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};

// Delete - Delete a student by ID
export const deleteStudent = async (id) => {
  try {
    const query = "DELETE FROM students WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: new Error("Student not found"),
      };
    }

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log("error in delete query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};

// Advanced - Search students by name
export const searchStudentsByName = async (name) => {
  try {
    const query = "SELECT * FROM students WHERE name ILIKE $1";
    const result = await pool.query(query, [`%${name}%`]);

    return {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log("error in search query catch > ", err);
    return {
      success: false,
      error: err,
    };
  }
};
