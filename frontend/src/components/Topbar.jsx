import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Topbar = ({ drawerWidth }) => {
  const navigate = useNavigate();
  // Retrieves the logged-in user's name, defaults to Reena Mahto if somehow missing during session
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {
    name: "Reena Mahto",
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ERP Management System
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Welcome, {userInfo.name}</Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            variant="outlined"
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
