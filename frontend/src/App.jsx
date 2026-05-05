import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import GRN from "./pages/GRN";

const theme = createTheme({
  palette: { primary: { main: "#1976d2" }, background: { default: "#f4f6f8" } },
});

// Simple auth check
const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <div style={{ padding: 20 }}>
                  <h1>Dashboard (WIP)</h1>
                </div>
              }
            />
            <Route path="products" element={<Products />} />

            <Route path="customers" element={<Customers />} />

            <Route path="orders" element={<Orders />} />

            <Route path="grn" element={<GRN />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
