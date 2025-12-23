import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SearchIcon from "@mui/icons-material/Search";
import DiamondIcon from "@mui/icons-material/Diamond";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Pitch Your Idea",
    desc: "Create startup pitches and showcase your vision directly to verified investors.",
    icon: <RocketLaunchIcon fontSize="large" />,
  },
  {
    title: "Find Investors",
    desc: "Discover investors aligned with your domain, stage, and startup vision.",
    icon: <SearchIcon fontSize="large" />,
  },
  {
    title: "Premium Search",
    desc: "Advanced AI-powered filters, priority visibility, and exclusive investor access.",
    icon: <DiamondIcon fontSize="large" />,
  },
];

const InvestorView = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* ---------- HERO SECTION ---------- */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{ letterSpacing: "-0.5px" }}
          gutterBottom
        >
           Investor Connect
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          maxWidth={700}
          mx="auto"
        >
          Bridging student founders with the right investors — smarter, faster,
          and more transparent.
        </Typography>
      </Box>

      {/* ---------- COMING SOON ---------- */}
      <Box
        textAlign="center"
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          mb: 6,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ mb: 1, textTransform: "uppercase" }}
        >
          🚧 Coming Soon
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          Under Development
        </Typography>

        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ opacity: 0.9 }}
        >
          Love from <span style={{ color: "#1976d2" }}>NARAYANASTRA</span> ❤️
        </Typography>
      </Box>

      {/* ---------- FEATURE PREVIEW ---------- */}
      <Grid container spacing={3} mb={6}>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 3,
                textAlign: "center",
                p: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box mb={2}>{f.icon}</Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {f.title}
                </Typography>
                <Typography color="text.secondary">
                  {f.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---------- ACTION ---------- */}
      <Stack alignItems="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Stack>
    </Container>
  );
};

export default InvestorView;
