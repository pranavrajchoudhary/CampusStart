import React from "react";
import { Box, Toolbar, Container, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useThemeMode } from "../../context/ThemeContext";

const DRAWER_WIDTH = 240;

const DashboardLayout = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar drawerWidth={DRAWER_WIDTH} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          backgroundColor: mode === "dark" ? theme.palette.background.default : "#F8F9FA",
          color: theme.palette.text.primary,
          transition: "all 0.3s ease",
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Container with reduced padding on mobile */}
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 3 },
            py: { xs: 1, sm: 3 },
            width: "100%",
            minHeight: "calc(100vh - 64px)", // account for toolbar height
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
