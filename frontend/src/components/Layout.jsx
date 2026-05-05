import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 240;

const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Topbar drawerWidth={drawerWidth} />
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          mt: 8,
        }}
      >
        <Outlet />{" "}
        {/* This is where the Pages (Products, Dashboard, etc.) render */}
      </Box>
    </Box>
  );
};

export default Layout;
