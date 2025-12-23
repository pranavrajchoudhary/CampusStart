import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useThemeMode } from "../../context/ThemeContext"; // 👈 import Theme Context

const Footer = () => {
  const theme = useTheme();
  const { mode } = useThemeMode(); // 🌙 Access dark/light mode

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: "auto",
        borderTop: "1px solid",
        borderColor:
          mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        backgroundColor:
          mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* 🟦 Column 1: Socials */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              Connect
            </Typography>
            <Box>
              <IconButton href="#" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <LinkedInIcon />
              </IconButton>
              <IconButton href="#" color="inherit">
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* 🟨 Column 2: Newsletter */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              Newsletter Soup
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Feel Your Ideas, Get at Well Ilonolch  
              Thee and Your Daetain
            </Typography>
          </Grid>

          {/* 🟩 Column 3: Links */}
          <Grid item xs={6} sm={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              Platform
            </Typography>
            <Link href="#" color="inherit" underline="hover">
              About
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Mentors
            </Link>
            <br />
            <Link href="#" color="inherit" underline="hover">
              Privacy
            </Link>
          </Grid>

          {/* 🟥 Column 4: Logo */}
          <Grid item xs={6} sm={3} sx={{ textAlign: { sm: "right" } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
               CampusStart
            </Typography>
          </Grid>
        </Grid>

        {/* 🔹 Bottom Note */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            pt: 6,
            color: theme.palette.text.secondary,
          }}
        >
          © {new Date().getFullYear()} CampusStart. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
