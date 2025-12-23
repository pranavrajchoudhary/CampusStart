import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Alert,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  DeleteOutline as DeleteIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Lightbulb as IdeaIcon,
} from "@mui/icons-material";
import { useThemeMode } from "../context/ThemeContext";
import API from "../api/axiosConfig";

const AIView = () => {
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = useTheme();
  const { mode } = useThemeMode();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setLoaded(true);
    fetchIdeas();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's ideas
  const fetchIdeas = async () => {
    try {
      setIdeasLoading(true);
      const token = localStorage.getItem("token");
      const response = await API.get("/ideas/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas(Array.isArray(response.data.ideas) ? response.data.ideas : []);
      setIdeasLoading(false);
      console.log(response)
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to load ideas");
      setIdeasLoading(false);
    }
  };

  // Get selected idea object
  const getSelectedIdeaObject = () => {
    return ideas.find(idea => idea._id === selectedIdea);
  };

  // Load conversation history when idea is selected
  const handleIdeaChange = async (event) => {
    const ideaId = event.target.value;
    setSelectedIdea(ideaId);
    setMessages([]);
    setError("");

    if (!ideaId) return;

    // Load conversation history
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/ai/conversation/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data.messages.length > 0) {
        setMessages(response.data.data.messages);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
      // Don't show error, just start fresh
    }
  };

  // Send message to AI
  const handleSubmit = async () => {
    if (!input.trim() || !selectedIdea) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    // Add temporary AI message
    const tempAiMessage = {
      role: "assistant",
      content: "Thinking...",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    try {
      const token = localStorage.getItem("token");
      const response = await API.post(
        "/ai/chat",
        {
          ideaId: selectedIdea,
          query: input,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Replace temp message with actual response
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: response.data.data.response,
            timestamp: new Date(),
            isLoading: false,
          };
          return newMessages;
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.response?.data?.message || "Failed to get AI response");

      // Remove temp message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation
  const handleClearChat = async () => {
    if (!selectedIdea) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/ai/conversation/${selectedIdea}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (err) {
      console.error("Error clearing conversation:", err);
      setMessages([]); // Clear locally anyway
    }
  };

  const selectedIdeaObj = getSelectedIdeaObject();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "all 0.4s ease",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Fade in={loaded} timeout={800}>
          <Box>
            {/* 🎯 Idea Selection Dropdown */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                mb: 3,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IdeaIcon sx={{ mr: 1, color: "primary.main", fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Select an Idea to Chat
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel id="idea-select-label">Choose Your Idea</InputLabel>
                <Select
                  labelId="idea-select-label"
                  id="idea-select"
                  value={selectedIdea}
                  label="Choose Your Idea"
                  onChange={handleIdeaChange}
                  disabled={ideasLoading}
                  sx={{
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  {ideasLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Loading ideas...
                    </MenuItem>
                  ) : ideas.length === 0 ? (
                    <MenuItem disabled>
                      No ideas available. Create one first!
                    </MenuItem>
                  ) : (
                    ideas.map((idea) => (
                      <MenuItem key={idea._id} value={idea._id}>
                        <Box sx={{ display: "flex", flexDirection: "column", py: 0.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {idea.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "500px",
                            }}
                          >
                            {idea.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Selected Idea Info */}
              {selectedIdeaObj && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor:
                      mode === "dark"
                        ? "rgba(144, 202, 249, 0.08)"
                        : "rgba(25, 118, 210, 0.08)",
                    border: `1px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected Idea Details:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Description:</strong> {selectedIdeaObj.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Domains:
                    </Typography>
                    {selectedIdeaObj.domain?.map((domain, idx) => (
                      <Chip
                        key={idx}
                        label={domain}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Team Size: {selectedIdeaObj.teamSize} | Skills:{" "}
                    {selectedIdeaObj.requiredSkills?.join(", ")}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* 💬 Chat Interface */}
            <Paper
              elevation={5}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                height: "calc(100vh - 400px)",
                minHeight: "500px",
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.paper,
                opacity: selectedIdea ? 1 : 0.6,
                pointerEvents: selectedIdea ? "auto" : "none",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BotIcon sx={{ mr: 1, color: "primary.main", fontSize: 28 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      AI Brainstorm Chat
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedIdea
                        ? `Chatting about: ${selectedIdeaObj?.title}`
                        : "Select an idea above to start"}
                    </Typography>
                  </Box>
                </Box>
                {selectedIdea && messages.length > 0 && (
                  <Tooltip title="Clear Chat History">
                    <IconButton onClick={handleClearChat} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {/* Chat Messages */}
              <Box
                ref={chatContainerRef}
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  mb: 2,
                  px: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme.palette.divider,
                    borderRadius: "4px",
                  },
                }}
              >
                {!selectedIdea ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <BotIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No Idea Selected
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                      Please select an idea from the dropdown above to start chatting with AI
                    </Typography>
                  </Box>
                ) : messages.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <BotIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
                      Start the conversation!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                      Ask me anything about "{selectedIdeaObj?.title}"
                    </Typography>
                  </Box>
                ) : (
                  messages.map((msg, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        mb: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      {msg.role === "assistant" && (
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 36,
                            height: 36,
                            mr: 1,
                          }}
                        >
                          <BotIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                      )}

                      <Paper
                        elevation={2}
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderRadius: 2,
                          maxWidth: "75%",
                          bgcolor: msg.role === "user"
                            ? mode === "dark"
                              ? "primary.dark"
                              : "primary.main"
                            : mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "#f5f5f5",
                          color: msg.role === "user"
                            ? "#fff"
                            : "text.primary",
                        }}
                      >
                        {msg.isLoading ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={16} />
                            <Typography variant="body2">Thinking...</Typography>
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              lineHeight: 1.6,
                            }}
                          >
                            {msg.content}
                          </Typography>
                        )}
                      </Paper>

                      {msg.role === "user" && (
                        <Avatar
                          sx={{
                            bgcolor: "secondary.main",
                            width: 36,
                            height: 36,
                            ml: 1,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                      )}
                    </Box>
                  ))
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Area */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-end",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={
                    selectedIdea
                      ? "Type your message here..."
                      : "Select an idea first to start chatting..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  disabled={!selectedIdea || loading}
                  multiline
                  maxRows={4}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!selectedIdea || loading || !input.trim()}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    minWidth: "auto",
                    height: "56px",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AIView;