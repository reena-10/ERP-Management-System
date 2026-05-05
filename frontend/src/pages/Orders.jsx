import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  TextField,
  Chip,
} from "@mui/material";
import { Delete, Add, ShoppingCart, PictureAsPdf } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("Sale");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      const [orderRes, custRes, prodRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders", config),
        axios.get("http://localhost:5000/api/customers", config),
        axios.get("http://localhost:5000/api/products", config),
      ]);
      setOrders(orderRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => setItems([...items, { product: "", quantity: 1 }]);
  const removeItemRow = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || items.some((i) => !i.product || i.quantity < 1)) {
      return alert("Please fill out all fields correctly.");
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          customer: selectedCustomer,
          orderType,
          items,
        },
        config,
      );

      setOpen(false);
      setSelectedCustomer("");
      setItems([{ product: "", quantity: 1 }]);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      alert(error.response?.data?.message || "Error creating order");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      await axios.delete(`http://localhost:5000/api/orders/${id}`, config);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  // --- NEW FEATURE: Generate PDF Invoice ---
  const generateInvoice = (order) => {
    const doc = new jsPDF();
    const orderId = order._id.substring(0, 8).toUpperCase();

    // Header
    doc.setFontSize(22);
    doc.text("INVOICE", 14, 20);
    doc.setFontSize(10);
    doc.text(`Invoice ID: INV-${orderId}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 35);
    doc.text(`Type: ${order.orderType} Order`, 14, 40);

    // Customer Info
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${order.customer?.name || "N/A"}`, 14, 62);
    doc.text(`Company: ${order.customer?.company || "N/A"}`, 14, 67);
    doc.text(`Email: ${order.customer?.email || "N/A"}`, 14, 72);
    doc.text(`Address: ${order.customer?.address || "N/A"}`, 14, 77);

    // Table Data mapping
    const tableData = order.items.map((item) => [
      item.product?.title || "Unknown Product",
      item.product?.sku || "N/A",
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`,
    ]);

    // Render Table
    doc.autoTable({
      startY: 90,
      head: [["Product", "SKU", "Qty", "Unit Price", "Line Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [25, 118, 210] }, // Material-UI Primary Blue
    });

    // Total Amount
    const finalY = doc.lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.text(`Grand Total: $${order.totalAmount.toFixed(2)}`, 14, finalY + 15);

    // Save File
    doc.save(`Invoice_${orderId}.pdf`);
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Order Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={() => setOpen(true)}
        >
          Create Order
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>{order._id.substring(0, 8).toUpperCase()}</TableCell>
                <TableCell>
                  <Chip
                    label={order.orderType}
                    color={order.orderType === "Sale" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.customer?.name || "Unknown"}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {/* NEW: Download Invoice Button */}
                  <IconButton
                    color="primary"
                    onClick={() => generateInvoice(order)}
                    title="Download Invoice"
                  >
                    <PictureAsPdf />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(order._id)}
                    title="Delete Order"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Create Order Modal Remains Unchanged --- */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white" }}>
          Create New Order
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box
            component="form"
            id="order-form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderType}
                  label="Order Type"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <MenuItem value="Sale">Sales Order (Deducts Stock)</MenuItem>
                  <MenuItem value="Purchase">
                    Purchase Order (Requires GRN)
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Customer / Supplier</InputLabel>
                <Select
                  value={selectedCustomer}
                  label="Customer / Supplier"
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {customers.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} ({c.company})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
              Line Items
            </Typography>

            {items.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <FormControl sx={{ flexGrow: 1 }} required>
                  <InputLabel>Select Product</InputLabel>
                  <Select
                    value={item.product}
                    label="Select Product"
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                  >
                    {products.map((p) => (
                      <MenuItem
                        key={p._id}
                        value={p._id}
                        disabled={orderType === "Sale" && p.stock < 1}
                      >
                        {p.title} - ${p.price} (Stock: {p.stock})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Qty"
                  type="number"
                  required
                  inputProps={{ min: 1 }}
                  sx={{ width: "100px" }}
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />

                <IconButton
                  color="error"
                  onClick={() => removeItemRow(index)}
                  disabled={items.length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addItemRow}
              sx={{ alignSelf: "flex-start" }}
            >
              Add Another Item
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button type="submit" form="order-form" variant="contained">
            Process Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
