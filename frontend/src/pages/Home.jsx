import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { features } from "../utils/mockData";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext"; // ✅ Global theme context

// Animation variants
const cardVariants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.8 },
  },
};

const Home = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode(); // ✅ Access global dark/light mode

  return (
    <Box
      sx={{
        overflow: "hidden",
        position: "relative",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "all 0.3s ease",
      }}
    >
      

      {/* 🟦 Hero Section */}
      <Box
        sx={{
          height: { xs: "80vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
          textAlign: "center",
          backgroundImage:
            "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1XiArJn3J7UTIZiLeNkdfHieX8V9GqF68NQ&s)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.55)",
            zIndex: 1,
          }}
        />

        {/* Text content */}
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 2, md: 4 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: "2.2rem", md: "3.8rem" },
                background: "linear-gradient(90deg, #0D6EFD, #F79B25)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Connecting Campus Minds
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 400,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Find your co-founder, brainstorm with AI, and connect with investors — all before
              you graduate.
            </Typography>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/signup"
                sx={{
                  py: 1.3,
                  px: 4,
                  fontSize: "1.1rem",
                  borderRadius: "30px",
                  fontWeight: 600,
                }}
              >
                Join Now
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* 🟨 About Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
            What is CampusStart?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            CampusStart is an exclusive platform for college students to bridge the gap between
            idea and execution. We provide the tools, the community, and the connections you need
            to build real, impactful startups right from your dorm room.
          </Typography>
        </Container>
      </Box>

      {/* 🟩 Features Grid */}
      <Container
        maxWidth="lg"
        sx={{
          py: 12,
          bgcolor: theme.palette.background.default,
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Everything You Need to Launch
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                variants={cardVariants}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -10 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={feature.image}
                      alt={feature.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
