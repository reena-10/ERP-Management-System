import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData,
      );

      // Save the JWT token and user info to LocalStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast.success(`Welcome back, ${response.data.name}!`);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
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
      <h2>ERP System Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
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

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#2e7d32",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
