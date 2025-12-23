import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Container,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const newsData = [
  {
    title: "Indian Startups Raised $1.2B in Q1 2025",
    summary:
      "Despite global slowdown, Indian startups showed resilience with strong funding in AI, FinTech, and EdTech sectors.",
    category: "Startup Funding",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
    link: "#",
  },
  {
    title: "AI & GenAI Are the Hottest Skills for Students in 2025",
    summary:
      "Students skilled in AI, ML, and Generative AI are getting hired faster by startups and tech companies.",
    category: "Student Trends",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    link: "#",
  },
  {
    title: "Top College Students Turning Founders Before Graduation",
    summary:
      "IITs, NITs, and private universities are witnessing a surge in student-led startups solving real problems.",
    category: "Campus Startups",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    link: "#",
  },
  {
    title: "Government Push for Student Entrepreneurs in India",
    summary:
      "Programs like Startup India, Atal Innovation Mission, and college incubators are empowering students.",
    category: "Policy & Support",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c",
    link: "#",
  },
  {
    title: "EdTech Startups Hiring College Students as Interns",
    summary:
      "Many EdTech startups are hiring students for paid internships, research roles, and developer positions.",
    category: "Opportunities",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    link: "#",
  },
];

const NewsView = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ---------- PAGE HEADER ---------- */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          🇮🇳 Startup News & Trends
        </Typography>
        <Typography color="text.secondary">
          Curated Indian startup & innovation news specially for students,
          builders, and future founders.
        </Typography>
      </Box>

      {/* ---------- NEWS GRID ---------- */}
      <Grid container spacing={3}>
        {newsData.map((news, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={news.image}
                alt={news.title}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Chip
                  label={news.category}
                  size="small"
                  color="primary"
                  sx={{ mb: 1 }}
                />

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {news.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {news.summary}
                </Typography>
              </CardContent>

              <Box p={2} pt={0}>
                <Button
                  size="small"
                  endIcon={<OpenInNewIcon />}
                  onClick={() => window.open(news.link, "_blank")}
                >
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---------- FOOTER NOTE ---------- */}
      <Box mt={5} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          🚀 More curated startup insights coming soon on CampusStart
        </Typography>
      </Box>
    </Container>
  );
};

export default NewsView;
