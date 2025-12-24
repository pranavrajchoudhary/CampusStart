import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  // ✅ NEW: loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 🛑 prevent duplicate submits
    if (loading) return;

    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        p: 2,
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7))",
          zIndex: 0,
        }}
      />

      {/* Glass Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ zIndex: 2, width: "100%", maxWidth: 420 }}
      >
        <Paper
          elevation={8}
          sx={{
            backdropFilter: "blur(16px)",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            p: 5,
            textAlign: "center",
            color: "#f5f5f5",
          }}
        >
          <Avatar
            sx={{
              m: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.25)",
              border: "2px solid rgba(255,255,255,0.3)",
              width: 56,
              height: 56,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white" }} />
          </Avatar>

          <Typography variant="h5" fontWeight={700}>
            Welcome Back 👋
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}
          >
            {loading ? "Signing you in..." : "We're glad to see you again."}
          </Typography>

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              name="email"
              type="email"
              placeholder="Email Address"
              required
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 10,
                },
              }}
            />

            <TextField
              name="password"
              type="password"
              placeholder="Password"
              required
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 10,
                },
              }}
            />

            <motion.div whileHover={{ scale: loading ? 1 : 1.03 }}>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.3,
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg, #0D6EFD 0%, #F79B25 100%)",
                  fontWeight: 600,
                  textTransform: "none",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </motion.div>

            <Typography variant="body2" sx={{ mt: 2, color: "#ccc" }}>
              Don’t have an account?{" "}
              <Link component={RouterLink} to="/signup" sx={{ color: "#0D6EFD" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
