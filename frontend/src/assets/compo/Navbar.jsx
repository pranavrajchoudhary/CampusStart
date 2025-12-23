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
  styled,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material"; // 🌗 Icons for theme toggle
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useThemeMode } from "../../context/ThemeContext"; // 🌙 Dark/Light mode hook
import { motion, AnimatePresence } from "framer-motion";

// 🌈 Styled components
const NavLink = styled(RouterLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
  margin: "0 1rem",
  fontWeight: 500,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "0%",
    height: "2px",
    bottom: "-4px",
    left: "0",
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
  },
}));

const Logo = styled(RouterLink)(() => ({
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
}));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useUser();
  const { mode, toggleMode } = useThemeMode(); // 🌗 Access theme mode context
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "About", path: "/about" },
    { text: "Features", path: "/features" },
  ];

  // 🔥 Scroll blur effect
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 📱 Drawer (Mobile Menu)
  const drawer = (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="h6" sx={{ my: 2, fontWeight: 600 }}>
          CampusStart
        </Typography>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              component={RouterLink}
              to={item.path}
              key={item.text}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  transform: "scale(1.03)",
                  transition: "all 0.2s",
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          <Box sx={{ mt: 2 }}>
            {user ? (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    navigate("/dashboard");
                    handleDrawerToggle();
                  }}
                  sx={{ mb: 1 }}
                >
                  Dashboard
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  component={RouterLink}
                  to="/login"
                  sx={{ mb: 1 }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  component={RouterLink}
                  to="/signup"
                >
                  Join Now
                </Button>
              </>
            )}
          </Box>
        </List>
      </Box>
    </motion.div>
  );

  return (
    <>
      {/* 🌫️ Glass Navbar */}
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: (theme) =>
            scrolled
              ? theme.palette.mode === "light"
                ? "rgba(255,255,255,0.8)"
                : "rgba(30,30,30,0.8)"
              : theme.palette.mode === "light"
              ? "rgba(255,255,255,0.5)"
              : "rgba(30,30,30,0.5)",
          transition: "background-color 0.4s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* 🚀 Logo */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Logo to="/">
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    letterSpacing: "0.5px",
                  }}
                >
                  CampusStart
                </Typography>
              </Logo>
            </motion.div>

            {/* 🧭 Desktop Nav Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              {navItems.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink to={item.path}>{item.text}</NavLink>
                </motion.div>
              ))}
            </Box>

            {/* 🌞 / 🌙 Theme Toggle + Auth Buttons */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={toggleMode} color="inherit" sx={{ mr: 1 }}>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                {user ? (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="contained" color="error" onClick={handleLogout}>
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        component={RouterLink}
                        to="/login"
                      >
                        Login
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/signup"
                      >
                        Join Now
                      </Button>
                    </motion.div>
                  </>
                )}
              </Box>

              {/* 🍔 Mobile Menu */}
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 📱 Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 260,
                background: (theme) =>
                  theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
