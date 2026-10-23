import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { createStudent } from "../services/studentService";
import type { StudentFormData } from "../types/Student";
import "./StudentForm.css";

const initialForm: StudentFormData = {
  name: "",
  email: "",
  age: "",
  course: "",
};

export default function StudentForm() {
  const [formData, setFormData] = useState<StudentFormData>(initialForm);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.age ||
      !formData.course
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const age = Number(formData.age);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      setError("Please enter an age between 1 and 120.");
      return;
    }

    try {
      setLoading(true);

      const response = await createStudent(formData);

      setMessage(response.message);
      setFormData(initialForm);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Unable to register student. Check the backend server.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-heading">
          <span className="form-icon">🎓</span>
          <h1>Student Registration</h1>
          <p>Enter student details to register.</p>
        </div>

        {message && (
          <div className="alert success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              min={1}
              max={120}
              step={1}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              <option value="React.js">React.js</option>
              <option value="Node.js">Node.js</option>
              <option value="Angular">Angular</option>
              <option value="Java Full Stack">Java Full Stack</option>
              <option value="MERN Stack">MERN Stack</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
