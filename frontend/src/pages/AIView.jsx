import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Container,
  Fade,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Send as SendIcon, DeleteOutline as DeleteIcon } from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";

const AIView = () => {
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [response, setResponse] = useState("");
  const theme = useTheme();
  const { mode } = useThemeMode();

  useEffect(() => setLoaded(true), []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const newEntry = { prompt: input, reply: "Thinking..." };
    setHistory((prev) => [newEntry, ...prev.slice(0, 4)]);
    setResponse("Generating...");
    setInput("");

    // 🧠 Simulated AI response (replace with backend API later)
    setTimeout(() => {
      const aiResponse =
        "Here’s a possible improvement: Focus on solving the specific pain point for a smaller niche market first. Iterate fast and gather user feedback.";
      setHistory((prev) => [{ prompt: newEntry.prompt, reply: aiResponse }, ...prev.slice(1)]);
      setResponse(aiResponse);
    }, 1000);
  };

  const handleClear = () => {
    setHistory([]);
    setResponse("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "all 0.4s ease",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="md">
        <Fade in={loaded} timeout={800}>
          <Paper
            elevation={5}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              bgcolor: theme.palette.background.paper,
              transition: "0.3s",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* 🧠 Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AI Brainstorm Chat
              </Typography>
              <Tooltip title="Clear History">
                <IconButton onClick={handleClear} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* 💬 Chat History */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor:
                  mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {history.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Start chatting with AI by describing your idea below.
                </Typography>
              ) : (
                history.map((chat, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        textAlign: "right",
                        mb: 1,
                      }}
                    >
                      <Paper
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 1,
                          borderRadius: 3,
                          bgcolor:
                            mode === "dark"
                              ? "primary.dark"
                              : "primary.light",
                          color:
                            mode === "dark"
                              ? "#fff"
                              : theme.palette.text.primary,
                          maxWidth: "80%",
                        }}
                      >
                        <Typography variant="body2">{chat.prompt}</Typography>
                      </Paper>
                    </Box>
                    <Box>
                      <Paper
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 1.5,
                          borderRadius: 3,
                          bgcolor:
                            mode === "dark"
                              ? "rgba(255,255,255,0.07)"
                              : "#f9f9f9",
                          maxWidth: "85%",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {chat.reply}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ))
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* ✏️ Input */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your idea or question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                endIcon={<SendIcon />}
                sx={{
                  px: 3,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default AIView;
