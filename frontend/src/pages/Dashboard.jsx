import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  ShoppingCart,
  People,
  WarningAmber,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. MOVED OUTSIDE: This fixes the ESLint error and improves React performance!
const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={3} sx={{ height: "100%", borderTop: `4px solid ${color}` }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            textTransform="uppercase"
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            p: 1.5,
            borderRadius: "50%",
            display: "flex",
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 2. Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        const orders = orderRes.data;
        const customers = custRes.data;
        const products = prodRes.data;

        const revenue = orders
          .filter((o) => o.orderType === "Sale" && o.status !== "Cancelled")
          .reduce((sum, order) => sum + order.totalAmount, 0);

        const lowStock = products.filter(
          (p) => p.stock <= (p.reorderLevel || 10),
        ).length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          lowStockCount: lowStock,
        });

        const salesByDate = {};
        orders.forEach((order) => {
          if (order.orderType === "Sale") {
            const date = new Date(order.createdAt).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" },
            );
            salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
          }
        });

        const chartData = Object.keys(salesByDate).map((date) => ({
          date,
          Revenue: salesByDate[date],
        }));

        setSalesData(chartData.slice(-7));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <Typography sx={{ p: 4 }}>Loading Dashboard...</Typography>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 4 }}>
        Overview Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<AttachMoney sx={{ color: "#2e7d32", fontSize: 32 }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart sx={{ color: "#1976d2", fontSize: 32 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<People sx={{ color: "#ed6c02", fontSize: 32 }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStockCount}
            icon={<WarningAmber sx={{ color: "#d32f2f", fontSize: 32 }} />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Revenue Trend (Recent Sales)
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="textSecondary">
                  No recent sales data to display.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              • Navigate to <b>Products</b> to update your inventory.
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              • Visit <b>Orders</b> to log new sales.
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              • Use <b>GRN</b> to receive goods from suppliers.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
