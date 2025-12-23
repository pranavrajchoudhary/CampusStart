import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useThemeMode } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  const navItems = [
    { text: "Home", id: "home" },
    { text: "About", id: "about" },
    { text: "Features", id: "features" },
    { text: "Developers", id: "developers" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography fontWeight={700}>CampusStart</Typography>

            {/* Desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
                <Typography
                  key={item.text}
                  sx={{ mx: 2, cursor: "pointer" }}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.text}
                </Typography>
              ))}
            </Box>

            <Box>
              <IconButton onClick={toggleMode}>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {user ? (
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
              ) : (
                <Button onClick={() => navigate("/login")}>Login</Button>
              )}

              <IconButton
                sx={{ display: { md: "none" } }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          >
            <List sx={{ width: 240 }}>
              {navItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  onClick={() => scrollToSection(item.id)}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
