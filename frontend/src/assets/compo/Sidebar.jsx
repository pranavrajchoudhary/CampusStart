import React, { useState } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LogoutIcon from "@mui/icons-material/Logout";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useThemeMode } from "../../context/ThemeContext";

const drawerWidth = 240;

const Sidebar = () => {
  const { user, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mode, toggleMode } = useThemeMode(); // 🌙 dark mode hook

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "AI Brainstormer", icon: <TipsAndUpdatesIcon />, path: "/dashboard/ai-brainstormer" },
    { text: "Community", icon: <PeopleIcon />, path: "/dashboard/community" },
    { text: "Matchmaking", icon: <GroupsIcon />, path: "/dashboard/smart-matchmaking" },
    { text: "Investor Connect", icon: <MonetizationOnIcon />, path: "/dashboard/investor-connect" },
    { text: "News & Trends", icon: <NewspaperIcon />, path: "/dashboard/news-trends" },
  ];

  const drawerContent = (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      bgcolor: theme.palette.background.default,
      color: theme.palette.text.primary,
    }}
  >
    {/* Top: Logo + Avatar + Nav */}
    <Box sx={{ overflowY: "auto", flex: 1 }}>
      {/* 🔹 Logo & Avatar Section */}
      <Toolbar sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          CampusStart
        </Typography>
      </Toolbar>

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Avatar
          sx={{ width: 64, height: 64, margin: "0 auto 16px" }}
          src={`https://api.multiavatar.com/${user?.email}.svg`}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.username || "Campus User"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* 🔹 Nav Links */}
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            end={item.path === "/dashboard"}
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              margin: "4px 12px",
              borderRadius: "8px",
              "&.active": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "primary.contrastText" },
              },
              "&:hover": {
                backgroundColor:
                  mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>

    {/* Bottom: Theme Toggle + Logout */}
    <Box>
      <Divider sx={{ my: 1, mx: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          p: 1,
        }}
      >
        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Logout">
          <IconButton color="error" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Box>
);


  return (
    <Box sx={{ display: "flex" }}>
      {/* 📱 AppBar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backdropFilter: "blur(10px)",
            background:
              mode === "dark"
                ? "rgba(18,18,18,0.8)"
                : "rgba(255,255,255,0.6)",
          }}
        >
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              CampusStart
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* 🖥️ Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0,0,0,0.1)",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
