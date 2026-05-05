import { useState, useEffect } from "react";
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
  Box,
  TextField,
  Chip,
} from "@mui/material";
import { AssignmentTurnedIn, Receipt } from "@mui/icons-material";

const GRN = () => {
  const [grns, setGrns] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState("");
  const [receivedItems, setReceivedItems] = useState([]);
  const [notes, setNotes] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        };

        const [grnRes, orderRes] = await Promise.all([
          axios.get("http://localhost:5000/api/grn", config),
          axios.get("http://localhost:5000/api/orders", config),
        ]);

        setGrns(grnRes.data);
        // Filter out only Purchase orders that haven't been completed yet
        const purchases = orderRes.data.filter(
          (o) => o.orderType === "Purchase" && o.status !== "Completed",
        );
        setPendingOrders(purchases);
      } catch (error) {
        console.error("Error fetching GRN data", error);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  // Auto-populate items when a Purchase Order is selected
  const handlePOSelect = (e) => {
    const poId = e.target.value;
    setSelectedPO(poId);

    const order = pendingOrders.find((o) => o._id === poId);
    if (order) {
      // Map the ordered items into our GRN receiving format
      const itemsToReceive = order.items.map((i) => ({
        product: i.product._id,
        title: i.product.title,
        quantityOrdered: i.quantity,
        quantityReceived: i.quantity, // Default to fully received
      }));
      setReceivedItems(itemsToReceive);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...receivedItems];
    newItems[index].quantityReceived = value;
    setReceivedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPO || receivedItems.some((i) => i.quantityReceived < 1)) {
      return alert("Please ensure all items have a valid received quantity.");
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      // Format payload to match backend schema
      const payload = {
        purchaseOrder: selectedPO,
        notes,
        receivedItems: receivedItems.map((i) => ({
          product: i.product,
          quantityReceived: i.quantityReceived,
        })),
      };

      await axios.post("http://localhost:5000/api/grn", payload, config);

      setOpen(false);
      setSelectedPO("");
      setReceivedItems([]);
      setNotes("");
      setRefreshTrigger((prev) => prev + 1); // Refresh tables!
    } catch (error) {
      alert(error.response?.data?.message || "Error processing GRN");
    }
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
          Goods Receipt Notes (GRN)
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AssignmentTurnedIn />}
          onClick={() => setOpen(true)}
        >
          Receive Goods
        </Button>
      </Box>

      {/* GRN History Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e8f5e9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>GRN ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Purchase Order Ref
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date Received</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Items Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grns.map((grn) => (
              <TableRow key={grn._id} hover>
                <TableCell>{grn._id.substring(0, 8).toUpperCase()}</TableCell>
                <TableCell>
                  {grn.purchaseOrder?._id.substring(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>
                  {grn.purchaseOrder?.customer?.company || "Unknown Supplier"}
                </TableCell>
                <TableCell>
                  {new Date(grn.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {grn.receivedItems.map((item, idx) => (
                    <Chip
                      key={idx}
                      label={`${item.product?.title}: ${item.quantityReceived} units`}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
            {grns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Goods Receipt Notes recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Process GRN Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "#2e7d32", color: "white" }}>
          Process Incoming Shipment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box
            component="form"
            id="grn-form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}
          >
            <FormControl fullWidth required>
              <InputLabel>Select Pending Purchase Order</InputLabel>
              <Select
                value={selectedPO}
                label="Select Pending Purchase Order"
                onChange={handlePOSelect}
              >
                {pendingOrders.map((po) => (
                  <MenuItem key={po._id} value={po._id}>
                    PO-{po._id.substring(0, 8).toUpperCase()} (Supplier:{" "}
                    {po.customer?.company})
                  </MenuItem>
                ))}
                {pendingOrders.length === 0 && (
                  <MenuItem disabled>
                    No pending purchase orders available.
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            {receivedItems.length > 0 && (
              <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Verify Incoming Quantities
                </Typography>
                {receivedItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <TextField
                      disabled
                      fullWidth
                      label="Product"
                      value={item.title}
                    />
                    <TextField
                      disabled
                      label="Ordered"
                      value={item.quantityOrdered}
                      sx={{ width: "120px" }}
                    />
                    <TextField
                      required
                      label="Actual Received"
                      type="number"
                      inputProps={{ min: 1, max: item.quantityOrdered }}
                      sx={{ width: "150px" }}
                      value={item.quantityReceived}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                  </Box>
                ))}
              </Box>
            )}

            <TextField
              label="Receiving Notes (Optional)"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="grn-form"
            variant="contained"
            color="success"
            disabled={!selectedPO}
          >
            Confirm Receipt & Add to Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GRN;
