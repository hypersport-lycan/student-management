const pool = require("../config/db");

const createStudent = async (req, res, next) => {
  try {
    const { name, email, age, course } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      age === undefined ||
      typeof course !== "string" ||
      !course.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate age
    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be between 1 and 120.",
      });
    }

    // Parameterized query prevents SQL injection
    const sql = `
      INSERT INTO students (name, email, age, course)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      name.trim(),
      email.trim().toLowerCase(),
      parsedAge,
      course.trim(),
    ]);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      student: {
        id: result.insertId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: parsedAge,
        course: course.trim(),
      },
    });
  } catch (error) {
    // MySQL duplicate-key error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    next(error);
  }
};

module.exports = { createStudent };
