import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

const SmartMatchmaking = () => {
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "",
    requiredSkills: "",
    rolesNeeded: "",
  });

  // ---------------- FETCH SAVED IDEAS ----------------
  useEffect(() => {
    API.get("/ideas/my")
      .then(res => setIdeas(res.data.ideas || []))
      .catch(() => setIdeas([]));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- MATCH EXISTING IDEA ----------------
  const handleMatchExisting = async () => {
    if (!selectedIdea) return;
    setLoading(true);
    setMatches([]);

    try {
      const res = await API.get(`/match/idea/${selectedIdea}`);
      setMatches(res.data);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE + MATCH ----------------
  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Title & Description required");
      return;
    }

    setLoading(true);
    setMatches([]);

    try {
      const payload = {
        ...form,
        domain: form.domain.split(",").map(s => s.trim()).filter(Boolean),
        requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        rolesNeeded: form.rolesNeeded.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await API.post("/ideas", payload);
      const ideaId = res.data.idea._id;

      const matchRes = await API.get(`/match/idea/${ideaId}`);
      setMatches(matchRes.data);
      setOpenForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        🤝 Smart MatchMaking
      </Typography>

      <Typography color="text.secondary" mb={2}>
        Your idea will be saved and used for collaboration recommendations.
      </Typography>

      {/* ---------------- EXISTING IDEAS ---------------- */}
      {ideas.length > 0 && (
        <Box mb={3}>
          <TextField
            select
            label="Use Saved Idea"
            fullWidth
            value={selectedIdea}
            onChange={(e) => setSelectedIdea(e.target.value)}
          >
            {ideas.map((idea) => (
              <MenuItem key={idea._id} value={idea._id}>
                {idea.title}
              </MenuItem>
            ))}
          </TextField>

          <Button
            sx={{ mt: 1 }}
            variant="outlined"
            onClick={handleMatchExisting}
            disabled={!selectedIdea || loading}
          >
            Match This Idea
          </Button>
        </Box>
      )}

      {/* ---------------- NEW IDEA FORM ---------------- */}
      <Button variant="contained" onClick={() => setOpenForm(p => !p)}>
        {openForm ? "Close Form" : "Create New Idea"}
      </Button>

      <Collapse in={openForm}>
        <Box display="grid" gap={2} mt={2}>
          <TextField label="Title" name="title" onChange={handleChange} />
          <TextField label="Description" name="description" multiline rows={3} onChange={handleChange} />
          <TextField label="Domain" name="domain" onChange={handleChange} />
          <TextField label="Skills" name="requiredSkills" onChange={handleChange} />
          <TextField label="Roles" name="rolesNeeded" onChange={handleChange} />

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            Create & Match
          </Button>
        </Box>
      </Collapse>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {/* ---------------- MATCH RESULTS ---------------- */}
      {matches.length > 0 && (
        <Grid container spacing={2} mt={3}>
          {matches.map((user) => (
            <Grid item xs={12} sm={6} key={user._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.profileName}</Typography>
                  <Typography>{user.headline}</Typography>

                  <Box mt={1}>
                    {user.skills?.map(skill => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Box>

                  <Typography mt={1}>
                    Match: {(user.matchScore * 100).toFixed(1)}%
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/dashboard/profile/${user._id}`)}
                  >
                    See Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SmartMatchmaking;
