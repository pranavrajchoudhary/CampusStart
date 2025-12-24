import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import API from "../api/axiosConfig";

const Signup = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!agree) {
      alert("Please accept the Terms & Conditions to continue.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const newUser = {
      username: `${data.get("firstName")} ${data.get("lastName")}`,
      email,
      password,
    };

    try {
      setLoading(true);

      // Register
      await API.post("/auth/register", newUser);

      // Auto login
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80')",
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
          backgroundColor: "rgba(0,0,0,0.55)",
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
            backgroundColor: "rgba(255,255,255,0.12)",
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
            <PersonAddAltIcon sx={{ color: "white" }} />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Create Your Account
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}
          >
            {loading
              ? "Setting things up..."
              : "Start your journey with CampusStart 🚀"}
          </Typography>

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "password", label: "Password", type: "password" },
              ].map((field, i) => (
                <Grid
                  item
                  xs={12}
                  sm={
                    field.name === "firstName" || field.name === "lastName"
                      ? 6
                      : 12
                  }
                  key={i}
                >
                  <TextField
                    name={field.name}
                    type={field.type || "text"}
                    required
                    fullWidth
                    placeholder={field.label}
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
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Terms */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  sx={{ color: "white", "&.Mui-checked": { color: "#0D6EFD" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  I agree to the{" "}
                  <Link href="#" sx={{ color: "#0D6EFD" }}>
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="#" sx={{ color: "#0D6EFD" }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 1.5, textAlign: "left" }}
            />

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.3,
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg, #0D6EFD 0%, #F79B25 100%)",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </motion.div>

            <Typography variant="body2" sx={{ mt: 1, color: "#ccc" }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" sx={{ color: "#0D6EFD" }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Signup;
