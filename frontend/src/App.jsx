import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Naya Register page import kiya hai
import Register from "./pages/Register";

// Placeholder components
const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to the ERP System</p>
  </div>
);
const Login = () => (
  <div>
    <h2>Login Page</h2>
    <p>Login form will go here...</p>
  </div>
);
const Products = () => (
  <div>
    <h2>Product Management</h2>
  </div>
);

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      <nav style={{ padding: "15px", background: "#333", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>ERP Management System</h2>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
