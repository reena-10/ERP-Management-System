import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    supplier: "",
  });

  // Get token from LocalStorage for API security
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  // Fetch Products on load
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/products",
        config,
      );
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (userInfo) fetchProducts();
  }, []);

  // Handle Form Change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add Product
  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:5000/api/products", formData, config);
      toast.success("Product Added Successfully");
      setOpen(false);
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        supplier: "",
      });
      fetchProducts(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        toast.success("Product Deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: "8px" }}
        >
          + Add New Product
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "10px" }}
      >
        <Table>
          <TableHead sx={{ background: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price (₹)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>₹{row.price}</TableCell>
                <TableCell
                  sx={{
                    color: row.stock < 10 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {row.stock}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(row._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found. Add one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Modal Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Add New Product</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="SKU (Barcode)"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Initial Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Supplier Name"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            color="primary"
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
