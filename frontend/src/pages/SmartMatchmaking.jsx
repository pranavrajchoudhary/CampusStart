import React, { useState } from "react";
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
  CircularProgress
} from "@mui/material";
import API from "../api/axiosConfig";

const SmartMatchmaking = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    domain: "",
    requiredSkills: "",
    rolesNeeded: ""
  });

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // ✅ FIX 1: basic validation
    if (!form.title.trim() || !form.description.trim()) {
      alert("Title and Description are required");
      return;
    }

    try {
      setLoading(true);
      setMatches([]);

      // ✅ FIX 2: safe split + trim
      const payload = {
        title: form.title,
        description: form.description,
        domain: form.domain.split(",").map(d => d.trim()).filter(Boolean),
        requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        rolesNeeded: form.rolesNeeded.split(",").map(r => r.trim()).filter(Boolean),
      };

      // 1️⃣ Create Idea
      const res = await API.post("/ideas", payload);
      const ideaId = res.data.idea._id;

      // 2️⃣ Matchmaking
      const matchRes = await API.get(`/match/idea/${ideaId}`);
      setMatches(matchRes.data);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🤝 Smart MatchMaking
      </Typography>

      <Box display="grid" gap={2} mb={4}>
        <TextField label="Idea Title" name="title" onChange={handleChange} />
        <TextField label="Description" name="description" multiline rows={3} onChange={handleChange} />
        <TextField label="Domain (comma separated)" name="domain" onChange={handleChange} />
        <TextField label="Required Skills" name="requiredSkills" onChange={handleChange} />
        <TextField label="Roles Needed" name="rolesNeeded" onChange={handleChange} />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Matching..." : "Find My Team 🚀"}
        </Button>
      </Box>

      {loading && <Box textAlign="center"><CircularProgress /></Box>}

      {matches.length > 0 && (
        <Grid container spacing={2}>
          {matches.map((user) => (
            <Grid item xs={12} sm={6} key={user._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.profileName}</Typography>
                  <Typography>{user.headline}</Typography>

                  <Box mt={1}>
                    {/* ✅ FIX 3: optional chaining */}
                    {user.skills?.map(skill => (
                      <Chip key={skill} label={skill} size="small" sx={{ mr: .5 }} />
                    ))}
                  </Box>

                  <Typography mt={1}>
                    Match: <b>{(user.matchScore * 100).toFixed(1)}%</b>
                  </Typography>
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
