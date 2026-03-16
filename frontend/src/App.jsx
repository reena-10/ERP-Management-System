import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Placeholder components - we will build these next!
const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
    <p>Welcome to the ERP System</p>
  </div>
);
const Login = () => (
  <div>
    <h2>Login Page</h2>
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

      {/* Navigation will go here later */}
      <nav style={{ padding: "10px", background: "#eee" }}>
        <h2>ERP System</h2>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
