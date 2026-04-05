import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Importing the professional CSS

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Layout from "./components/Layout";

const Dashboard = () => (
  <div>
    <h2>Dashboard Analytics (Coming Soon)</h2>
  </div>
);
const Customers = () => (
  <div>
    <h2>Customer & Supplier Directory (Coming Soon)</h2>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes wrapped in Layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/customers"
          element={
            <Layout>
              <Customers />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
