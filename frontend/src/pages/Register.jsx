import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend ke register API ko data bhejna
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData,
      );

      toast.success("User Registered Successfully!");
      console.log("Registered User:", response.data);

      // Register hone ke baad login page par bhej dena
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Create New Account</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          style={{ padding: "10px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          onChange={handleChange}
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          style={{ padding: "10px" }}
        />

        <select name="role" onChange={handleChange} style={{ padding: "10px" }}>
          <option value="Sales">Sales</option>
          <option value="Purchase">Purchase</option>
          <option value="Inventory">Inventory</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#1976d2",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
