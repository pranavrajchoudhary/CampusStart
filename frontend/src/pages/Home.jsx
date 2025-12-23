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
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { features } from "../utils/mockData";

// Animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Home = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>

      {/* ================= HERO ================= */}
      <Box
        id="home"
        sx={{
          minHeight: { xs: "85vh", md: "95vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          color: "#fff",
          backgroundImage: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.7),
              rgba(0,0,0,0.9)
            ),
            url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="md">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: "2.3rem", md: "3.8rem" },
                lineHeight: 1.2,
                textAlign: "center",
                color: "#ffffff", // ✅ FIX
                textShadow: "0 4px 18px rgba(0,0,0,0.6)", // ✅ FIX
              }}
            >
              Build Startups From Your Campus
            </Typography>

            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                maxWidth: 650,
                mx: "auto",
                mb: 4,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              CampusStart helps students find co-founders, brainstorm ideas with AI,
              collaborate with peers, and connect with the startup ecosystem — early.
            </Typography>

            <Box textAlign="center">
              <Button
                component={RouterLink}
                to="/signup"
                size="large"
                variant="contained"
                sx={{
                  px: 5,
                  py: 1.4,
                  borderRadius: 50,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                }}
              >
                Get Started
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ================= ABOUT ================= */}
      <Container
        id="about"
        maxWidth="md"
        sx={{ py: 10, textAlign: "center" }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          What is CampusStart?
        </Typography>
        <Typography variant="h6" color="text.secondary">
          CampusStart is a student-first innovation platform designed to turn
          raw campus ideas into real-world startups.
        </Typography>
      </Container>

      {/* ================= FEATURES ================= */}
      <Container id="features" maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 6 }}
        >
          Everything You Need to Build
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: theme.shadows[6],
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= DEVELOPERS ================= */}
<Box
  id="developers"
  sx={{
    bgcolor: theme.palette.background.paper,
    py: { xs: 6, md: 10 },
  }}
>
  <Container maxWidth="lg">
    <Typography
      variant="h4"
      align="center"
      fontWeight={700}
      gutterBottom
    >
      Built With ❤️ At Narayanastra
    </Typography>

    <Divider sx={{ my: 4 }} />

    <Grid
      container
      spacing={6}
      justifyContent="center"
      alignItems="stretch"
    >
      {/* -------- Developer 1 -------- */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Pranav Raj Choudhary
        </Typography>
        <Typography color="text.secondary">
          MERN Stack & LLM Developer
          <br />
          Architect of CampusStart’s backend, frontend,
          and intelligent collaboration workflows.
        </Typography>
      </Grid>

      {/* -------- Developer 2 -------- */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Abhishek Rajpoot
        </Typography>
        <Typography color="text.secondary">
          Machine Learning & Artificial Intelligence Engineer
          <br />
          Focused on intelligent matchmaking, AI brainstorming,
          and data-driven systems.
        </Typography>
      </Grid>
    </Grid>
  </Container>
</Box>

    </Box>
  );
};

export default Home;
