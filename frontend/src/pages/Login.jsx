import React from "react";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
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
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
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

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome Back 👋
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}
          >
            We're glad to see you again. Let’s continue your journey!
          </Typography>

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            {[
              { name: "email", type: "email", placeholder: "Email Address" },
              { name: "password", type: "password", placeholder: "Password" },
            ].map((field, i) => (
              <TextField
                key={i}
                {...field}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: "rgba(255,255,255,0.8)" },
                }}
                InputProps={{
                  style: {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.2)",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": {
                      border: "1px solid rgba(255,255,255,0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      border: "1px solid #0D6EFD",
                    },
                  },
                  "& input": {
                    textAlign: "center",
                    "::placeholder": {
                      color: "rgba(255,255,255,0.6)",
                      opacity: 1,
                    },
                  },
                }}
              />
            ))}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.3,
                  fontSize: "1rem",
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg, #0D6EFD 0%, #F79B25 100%)",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Sign In
              </Button>
            </motion.div>

            <Typography variant="body2" sx={{ mt: 1, color: "#ccc" }}>
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
